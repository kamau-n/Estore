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
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
  usersGrowth: number;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  recentSales: Array<{
    date: string;
    amount: number;
  }>;
  ordersByStatus: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
}

export default function AnalyticsPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/");
      return;
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user || !isAdmin) return;

      try {
        // Fetch all data
        const [ordersSnapshot, usersSnapshot, productsSnapshot] =
          await Promise.all([
            getDocs(collection(db, "orders")),
            getDocs(collection(db, "users")),
            getDocs(collection(db, "products")),
          ]);

        const orders = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const users = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const products = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Calculate analytics
        const totalRevenue = orders.reduce(
          (sum, order: any) => sum + (order.total || 0),
          0
        );
        const totalOrders = orders.length;
        const totalUsers = users.length;
        const totalProducts = products.length;

        // Calculate growth (mock data for demo)
        const revenueGrowth = 12.5;
        const ordersGrowth = 8.3;
        const usersGrowth = 15.2;

        // Top products (mock data)
        const topProducts = [
          { name: "Wireless Headphones", sales: 45, revenue: 67500 },
          { name: "Smartphone Case", sales: 38, revenue: 19000 },
          { name: "Laptop Stand", sales: 32, revenue: 48000 },
          { name: "USB Cable", sales: 28, revenue: 14000 },
          { name: "Power Bank", sales: 25, revenue: 37500 },
        ];

        // Recent sales (mock data)
        const recentSales = [
          { date: "2024-01-01", amount: 12500 },
          { date: "2024-01-02", amount: 15200 },
          { date: "2024-01-03", amount: 9800 },
          { date: "2024-01-04", amount: 18600 },
          { date: "2024-01-05", amount: 22100 },
          { date: "2024-01-06", amount: 16400 },
          { date: "2024-01-07", amount: 19800 },
        ];

        // Orders by status
        const ordersByStatus = {
          pending: orders.filter((o: any) => o.status === "pending").length,
          processing: orders.filter((o: any) => o.status === "processing")
            .length,
          shipped: orders.filter((o: any) => o.status === "shipped").length,
          delivered: orders.filter((o: any) => o.status === "delivered").length,
          cancelled: orders.filter((o: any) => o.status === "cancelled").length,
        };

        setAnalytics({
          totalRevenue,
          totalOrders,
          totalUsers,
          totalProducts,
          revenueGrowth,
          ordersGrowth,
          usersGrowth,
          topProducts,
          recentSales,
          ordersByStatus,
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, isAdmin, toast]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "KES",
    }).format(price);
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

  if (!analytics) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Analytics</h1>
          <p className="text-muted-foreground">No analytics data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Track your store's performance and growth
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(analytics.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+
              {analytics.revenueGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalOrders}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+
              {analytics.ordersGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+
              {analytics.usersGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Active products in catalog
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Details */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Top Selling Products
            </CardTitle>
            <CardDescription>
              Best performing products by sales volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.sales} sales
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatPrice(product.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
            <CardDescription>Current status of all orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Pending</Badge>
                </div>
                <span className="font-medium">
                  {analytics.ordersByStatus.pending}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="default">Processing</Badge>
                </div>
                <span className="font-medium">
                  {analytics.ordersByStatus.processing}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="default">Shipped</Badge>
                </div>
                <span className="font-medium">
                  {analytics.ordersByStatus.shipped}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="default">Delivered</Badge>
                </div>
                <span className="font-medium">
                  {analytics.ordersByStatus.delivered}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Cancelled</Badge>
                </div>
                <span className="font-medium">
                  {analytics.ordersByStatus.cancelled}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales Trend</CardTitle>
          <CardDescription>Daily sales for the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recentSales.map((sale, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {new Date(sale.date).toLocaleDateString()}
                </span>
                <span className="font-medium">{formatPrice(sale.amount)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
