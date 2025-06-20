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
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  DollarSign,
  RefreshCw,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
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
import { payment } from "@/types/paymentType";

export default function PaymentsManagementPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [payments, setPayments] = useState<payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/");
      return;
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user || !isAdmin) return;

      try {
        const paymentsRef = collection(db, "payments");
        const q = query(
          paymentsRef,
          where("product", "==", "estore"),
          orderBy("createdAt", "desc")
        );
        const paymentsSnapshot = await getDocs(q);

        const paymentsData = paymentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as payment[];

        setPayments(paymentsData);
      } catch (error) {
        console.error("Error fetching payments:", error);
        toast({
          title: "Error",
          description: "Failed to load payments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user, isAdmin, toast]);

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(numPrice);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "success":
      case "successful":
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "failed":
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
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

  const getChannelBadgeVariant = (channel: string) => {
    switch (channel?.toLowerCase()) {
      case "card":
        return "default";
      case "mobile_money":
      case "mpesa":
        return "secondary";
      case "bank":
        return "outline";
      default:
        return "outline";
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      payment.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesChannel =
      channelFilter === "all" ||
      payment.channel.toLowerCase() === channelFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesChannel;
  });

  // Calculate statistics
  const totalPayments = payments.length;
  const successfulPayments = payments.filter((p) =>
    ["success", "successful", "completed"].includes(p.status?.toLowerCase())
  ).length;
  const pendingPayments = payments.filter(
    (p) => p.status?.toLowerCase() === "pending"
  ).length;
  const failedPayments = payments.filter((p) =>
    ["failed", "cancelled"].includes(p.status?.toLowerCase())
  ).length;
  const totalRevenue = payments
    .filter((p) =>
      ["success", "successful", "completed"].includes(p.status?.toLowerCase())
    )
    .reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);

  const refreshPayments = async () => {
    setLoading(true);
    try {
      const paymentsRef = collection(db, "payments");
      const q = query(
        paymentsRef,
        where("product", "==", "estore"),
        orderBy("createdAt", "desc")
      );
      const paymentsSnapshot = await getDocs(q);

      const paymentsData = paymentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as payment[];

      setPayments(paymentsData);
      toast({
        title: "Success",
        description: "Payments refreshed successfully",
      });
    } catch (error) {
      console.error("Error refreshing payments:", error);
      toast({
        title: "Error",
        description: "Failed to refresh payments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Payment Management</h1>
            <p className="text-muted-foreground">
              View and manage all estore payments
            </p>
          </div>
          <Button onClick={refreshPayments} disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{totalPayments}</div>
                <div className="text-sm text-muted-foreground">
                  Total Payments
                </div>
              </div>
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {successfulPayments}
                </div>
                <div className="text-sm text-muted-foreground">Successful</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {pendingPayments}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {failedPayments}
                </div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {formatPrice(totalRevenue)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Revenue
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search payments..."
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
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="successful">Successful</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={channelFilter} onValueChange={setChannelFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="mobile_money">Mobile Money</SelectItem>
            <SelectItem value="mpesa">M-Pesa</SelectItem>
            <SelectItem value="bank">Bank</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payments List */}
      {filteredPayments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm || statusFilter !== "all" || channelFilter !== "all"
                ? "No payments found"
                : "No payments yet"}
            </h3>
            <p className="text-muted-foreground text-center">
              {searchTerm || statusFilter !== "all" || channelFilter !== "all"
                ? "Try adjusting your search terms or filters"
                : "Payments will appear here when customers make purchases"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <Card key={payment.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Payment #{payment.reference}
                    </CardTitle>
                    <CardDescription>
                      {payment.customer} • {formatDate(payment.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={getStatusVariant(payment.status)}
                      className="flex items-center gap-1">
                      {getStatusIcon(payment.status)}
                      {payment.status}
                    </Badge>
                    <Badge variant={getChannelBadgeVariant(payment.channel)}>
                      {payment.channel}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Payment Details</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p className="font-medium text-foreground text-lg">
                        {formatPrice(payment.amount)}
                      </p>
                      <p>Currency: {payment.currency}</p>
                      <p>Channel: {payment.channel}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Customer Info</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{payment.customer}</p>
                      <p>User ID: {payment.userId?.slice(-8) || "N/A"}</p>
                      {payment.orderId && (
                        <p>Order: #{payment.orderId.slice(-8)}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Timestamps</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Created: {formatDate(payment.createdAt)}</p>
                      {payment.paidAt && (
                        <p>Paid: {formatDate(payment.paidAt)}</p>
                      )}
                      {payment.refundedAt && (
                        <p className="text-destructive">
                          Refunded: {formatDate(payment.refundedAt)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    {payment.orderId && (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/orders/${payment.orderId}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Order
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span>Payment ID: {payment.id}</span>
                    <span>
                      Reference: {payment.paymentReference || payment.reference}
                    </span>
                    {payment.paymentFor && (
                      <span>Payment For: {payment.paymentFor}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
