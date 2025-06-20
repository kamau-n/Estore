"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { db, storage } from "@/lib/firebase";
import { LoadingSpinner } from "@/components/loading-spinner";
import {
  User,
  Package,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Receipt,
  DollarSign,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PaymentData {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  channel: string;
  reference: string;
  paymentReference: string;
  paidAt?: string;
  refundedAt?: string;
  authorization: {
    authorizationCode?: string;
    bin?: string;
    last4?: string;
    expMonth?: string;
    expYear?: string;
    cardType?: string;
    bank?: string;
  };
}

interface Order {
  id: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  trackingNumber?: string;
  paymentData?: PaymentData;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderPayment, setSelectedOrderPayment] = useState<
    string | null
  >(null);
  const [profileData, setProfileData] = useState({
    displayName: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        displayName: user.displayName || "",
        email: user.email || "",
        phone: "",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
      });
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      // Fetch orders
      const ordersQuery = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      const ordersData = ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];

      // Fetch payment data for each order
      const ordersWithPayments = await Promise.all(
        ordersData.map(async (order) => {
          try {
            const paymentsQuery = query(
              collection(db, "payments"),
              where("orderId", "==", order.id),
              orderBy("createdAt", "desc")
            );
            const paymentsSnapshot = await getDocs(paymentsQuery);

            if (!paymentsSnapshot.empty) {
              const paymentDoc = paymentsSnapshot.docs[0];
              const paymentData = {
                id: paymentDoc.id,
                ...paymentDoc.data(),
              } as PaymentData;

              return {
                ...order,
                paymentData,
              };
            }
            return order;
          } catch (error) {
            console.error(
              `Error fetching payment for order ${order.id}:`,
              error
            );
            return order;
          }
        })
      );

      setOrders(ordersWithPayments);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: profileData.displayName,
      });

      // Update Firestore user document
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: profileData.displayName,
        phone: profileData.phone,
        address: profileData.address,
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await updateProfile(user, {
        photoURL: downloadURL,
      });

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Error",
        description: "Failed to update profile picture",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPaymentMethod = (paymentData?: PaymentData) => {
    if (!paymentData) return "Unknown";

    if (paymentData.authorization?.last4) {
      return `${paymentData.authorization.cardType || "Card"} ending in ${
        paymentData.authorization.last4
      }`;
    }

    return paymentData.channel || "Unknown";
  };

  const togglePaymentDetails = (orderId: string) => {
    setSelectedOrderPayment(selectedOrderPayment === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p>Please sign in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account and view your orders
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Addresses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and profile picture
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.photoURL || ""} />
                    <AvatarFallback className="text-lg">
                      {user.displayName?.charAt(0) ||
                        user.email?.charAt(0) ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <Button variant="outline" asChild>
                        <span>Change Picture</span>
                      </Button>
                    </Label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Full Name</Label>
                    <Input
                      id="displayName"
                      value={profileData.displayName}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          displayName: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={profileData.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      placeholder="+254 700 000 000"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button onClick={handleSaveProfile} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                  View and track your orders with payment details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No orders found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="border">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="font-semibold">
                                Order #{order.id.slice(-8)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatDistanceToNow(
                                  new Date(order.createdAt),
                                  { addSuffix: true }
                                )}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={`${getStatusColor(
                                  order.status
                                )} flex items-center gap-1`}>
                                {getStatusIcon(order.status)}
                                {order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1)}
                              </Badge>
                              {order.paymentData && (
                                <Badge
                                  className={`${getPaymentStatusColor(
                                    order.paymentData.status
                                  )} flex items-center gap-1`}>
                                  <DollarSign className="h-3 w-3" />
                                  {order.paymentData.status
                                    .charAt(0)
                                    .toUpperCase() +
                                    order.paymentData.status.slice(1)}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="space-y-3">
                            {order.items.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3">
                                <img
                                  src={
                                    item.image ||
                                    "/placeholder.svg?height=50&width=50"
                                  }
                                  alt={item.name}
                                  className="h-12 w-12 rounded object-cover"
                                />
                                <div className="flex-1">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Quantity: {item.quantity} × KES{" "}
                                    {item.price.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <Separator className="my-4" />

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <CreditCard className="h-4 w-4" />
                                {formatPaymentMethod(order.paymentData)}
                              </div>
                              {order.trackingNumber && (
                                <div className="flex items-center gap-1">
                                  <Truck className="h-4 w-4" />
                                  Tracking: {order.trackingNumber}
                                </div>
                              )}
                            </div>
                            <p className="font-semibold">
                              Total: KES {order.total.toLocaleString()}
                            </p>
                          </div>

                          {/* Payment Details Section */}
                          {order.paymentData && (
                            <div className="mt-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => togglePaymentDetails(order.id)}
                                className="flex items-center gap-2">
                                <Receipt className="h-4 w-4" />
                                {selectedOrderPayment === order.id
                                  ? "Hide"
                                  : "Show"}{" "}
                                Payment Details
                              </Button>

                              {selectedOrderPayment === order.id && (
                                <div className="mt-3 p-4 bg-muted rounded-lg space-y-2">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">
                                        Payment Reference:
                                      </span>
                                      <p className="text-muted-foreground">
                                        {order.paymentData.reference}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        Payment ID:
                                      </span>
                                      <p className="text-muted-foreground">
                                        {order.paymentData.paymentReference}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        Channel:
                                      </span>
                                      <p className="text-muted-foreground">
                                        {order.paymentData.channel}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        Currency:
                                      </span>
                                      <p className="text-muted-foreground">
                                        {order.paymentData.currency}
                                      </p>
                                    </div>
                                    {order.paymentData.paidAt && (
                                      <div>
                                        <span className="font-medium">
                                          Paid At:
                                        </span>
                                        <p className="text-muted-foreground">
                                          {formatDistanceToNow(
                                            new Date(order.paymentData.paidAt),
                                            { addSuffix: true }
                                          )}
                                        </p>
                                      </div>
                                    )}
                                    {order.paymentData.authorization?.bank && (
                                      <div>
                                        <span className="font-medium">
                                          Bank:
                                        </span>
                                        <p className="text-muted-foreground">
                                          {order.paymentData.authorization.bank}
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  {order.paymentData.status === "refunded" &&
                                    order.paymentData.refundedAt && (
                                      <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded">
                                        <p className="text-sm font-medium text-orange-800">
                                          Refund Information
                                        </p>
                                        <p className="text-sm text-orange-700">
                                          Refunded{" "}
                                          {formatDistanceToNow(
                                            new Date(
                                              order.paymentData.refundedAt
                                            ),
                                            { addSuffix: true }
                                          )}
                                        </p>
                                      </div>
                                    )}
                                </div>
                              )}
                            </div>
                          )}

                          {order.status === "shipped" &&
                            order.trackingNumber && (
                              <div className="mt-4">
                                <Button variant="outline" size="sm">
                                  Track Package
                                </Button>
                              </div>
                            )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Addresses</CardTitle>
                <CardDescription>
                  Manage your shipping addresses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={profileData.address.street}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: { ...prev.address, street: e.target.value },
                        }))
                      }
                      disabled={!isEditing}
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={profileData.address.city}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: { ...prev.address, city: e.target.value },
                        }))
                      }
                      disabled={!isEditing}
                      placeholder="Nairobi"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/County</Label>
                    <Input
                      id="state"
                      value={profileData.address.state}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: { ...prev.address, state: e.target.value },
                        }))
                      }
                      disabled={!isEditing}
                      placeholder="Nairobi County"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Postal Code</Label>
                    <Input
                      id="zipCode"
                      value={profileData.address.zipCode}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: { ...prev.address, zipCode: e.target.value },
                        }))
                      }
                      disabled={!isEditing}
                      placeholder="00100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={profileData.address.country}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: { ...prev.address, country: e.target.value },
                        }))
                      }
                      disabled={!isEditing}
                      placeholder="Kenya"
                    />
                  </div>
                </div>

                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Address
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Address"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
