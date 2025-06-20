"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  CreditCard,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { payment } from "@/types/paymentType";

interface Order {
  id: string;
  userId: string;
  items: any[];
  total: number;
  shippingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  };
  status: string;
  paymentStatus: string;
  paymentReference?: string;
  createdAt: string;
  updatedAt: string;
  payments?: payment[]; // Add payments to order interface
}

export default function OrdersManagementPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/");
      return;
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    const fetchOrdersWithPayments = async () => {
      if (!user || !isAdmin) return;

      try {
        // Fetch orders
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        const ordersData = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];

        // Fetch all payments
        const paymentsRef = collection(db, "payments");
        const q = query(paymentsRef, where("product", "==", "estore"));
        const paymentsSnapshot = await getDocs(q);

        const paymentsData = paymentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as payment[];

        // Group payments by orderId and attach to orders
        const ordersWithPayments = ordersData.map((order) => ({
          ...order,
          payments: paymentsData.filter(
            (payment) => payment.orderId === order.id
          ),
        }));

        setOrders(
          ordersWithPayments.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      } catch (error) {
        console.error("Error fetching orders with payments:", error);
        toast({
          title: "Error",
          description: "Failed to load orders and payments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersWithPayments();
  }, [user, isAdmin, toast]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(numPrice);
  };

  const formatDate = (date: Date | string | Timestamp) => {
    console.log(date);

    let dateObj: Date;

    if (typeof date === "string") {
      dateObj = new Date(date);
    } else if (date instanceof Date) {
      dateObj = date;
    } else if (date?.toDate) {
      // Handles Firebase Timestamp
      dateObj = date.toDate();
    } else {
      throw new Error("Invalid date format");
    }

    return dateObj.toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Package className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "processing":
        return "default";
      case "shipped":
        return "default";
      case "delivered":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getPaymentStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "success":
      case "successful":
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingInfo.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.shippingInfo.lastName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.shippingInfo.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <p className="text-muted-foreground">
          View and manage customer orders with payment details
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? "No orders found" : "No orders yet"}
            </h3>
            <p className="text-muted-foreground text-center">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Orders will appear here when customers make purchases"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Order #{order.id.slice(-8)}
                    </CardTitle>
                    <CardDescription>
                      {order.shippingInfo.firstName}{" "}
                      {order.shippingInfo.lastName} •{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={getStatusVariant(order.status)}
                      className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Badge>
                    <Badge variant="outline">{order.paymentStatus}</Badge>
                    {order.payments && order.payments.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        {order.payments.length} payment
                        {order.payments.length > 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold mb-2">Customer Info</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{order.shippingInfo.email}</p>
                      <p>{order.shippingInfo.phone}</p>
                      <p>
                        {order.shippingInfo.address}, {order.shippingInfo.city},{" "}
                        {order.shippingInfo.state}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Order Details</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{order.items.length} items</p>
                      <p className="font-medium text-foreground">
                        {formatPrice(order.total)}
                      </p>
                      {order.paymentReference && (
                        <p>Ref: {order.paymentReference}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      value={order.status}
                      onValueChange={(value) =>
                        handleStatusUpdate(order.id, value)
                      }
                      disabled={updatingStatus === order.id}>
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/orders/${order.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Payment Details Section */}
                {order.payments && order.payments.length > 0 && (
                  <Collapsible
                    open={expandedOrders.has(order.id)}
                    onOpenChange={() => toggleOrderExpansion(order.id)}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-0 h-auto">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span className="font-medium">
                            Payment Details ({order.payments.length})
                          </span>
                        </div>
                        {expandedOrders.has(order.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4">
                      <div className="border rounded-lg p-4 bg-muted/20">
                        <div className="space-y-4">
                          {order.payments.map((payment, index) => (
                            <div
                              key={payment.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-background rounded border">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={getPaymentStatusVariant(
                                      payment.status
                                    )}>
                                    {payment.status}
                                  </Badge>
                                  <span className="text-sm font-medium">
                                    {formatPrice(payment.amount)}
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground space-y-1">
                                  <p>Reference: {payment.reference}</p>
                                  <p>Channel: {payment.channel}</p>
                                  <p>Currency: {payment.currency}</p>
                                  {payment.paidAt && (
                                    <p>Paid: {formatDate(payment.paidAt)}</p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right mt-2 sm:mt-0">
                                <div className="text-xs text-muted-foreground">
                                  Created: {formatDate(payment.createdAt)}
                                </div>
                                {payment.refundedAt && (
                                  <div className="text-xs text-destructive">
                                    Refunded: {formatDate(payment.refundedAt)}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                {/* No Payments Message */}
                {(!order.payments || order.payments.length === 0) && (
                  <div className="mt-4 p-3 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      No payments recorded for this order
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{orders.length}</div>
            <div className="text-sm text-muted-foreground">Total Orders</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {orders.filter((o) => o.status === "pending").length}
            </div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {orders.filter((o) => o.status === "processing").length}
            </div>
            <div className="text-sm text-muted-foreground">Processing</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {orders.filter((o) => o.status === "shipped").length}
            </div>
            <div className="text-sm text-muted-foreground">Shipped</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {orders.filter((o) => o.status === "delivered").length}
            </div>
            <div className="text-sm text-muted-foreground">Delivered</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
