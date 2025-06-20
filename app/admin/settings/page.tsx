"use client";

import type React from "react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Store, CreditCard, Truck, Mail } from "lucide-react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [storeSettings, setStoreSettings] = useState({
    storeName: "EStore",
    storeDescription: "Your one-stop shop for quality products",
    storeEmail: "support@estore.co.ke",
    storePhone: "+254 759 155 650",
    storeAddress: "123 Commerce Street, Victoria Island, Nairobi, Kenya",
    currency: "KES",
    taxRate: "7.5",
    freeShippingThreshold: "10000",
  });

  const [paymentSettings, setPaymentSettings] = useState({
    paystackEnabled: true,
    paystackPublicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
    paystackSecretKey: "",
  });

  const [shippingSettings, setShippingSettings] = useState({
    standardShippingCost: "2000",
    expressShippingCost: "5000",
    freeShippingEnabled: true,
    internationalShipping: false,
  });

  const [emailSettings, setEmailSettings] = useState({
    orderConfirmationEnabled: true,
    shippingNotificationEnabled: true,
    marketingEmailsEnabled: true,
    newsletterEnabled: true,
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/");
      return;
    }
  }, [user, isAdmin, authLoading, router]);

  const handleStoreSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setStoreSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPaymentSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleShippingSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setShippingSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (
    section: string,
    name: string,
    checked: boolean
  ) => {
    if (section === "payment") {
      setPaymentSettings((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (section === "shipping") {
      setShippingSettings((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (section === "email") {
      setEmailSettings((prev) => ({
        ...prev,
        [name]: checked,
      }));
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // In a real app, you would save these settings to your database
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "Settings saved successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || !isAdmin) {
    router.push("/");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Store Settings</h1>
        <p className="text-muted-foreground">
          Configure your store settings and preferences
        </p>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>

        {/* Store Settings */}
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Store Information
              </CardTitle>
              <CardDescription>
                Basic information about your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    name="storeName"
                    value={storeSettings.storeName}
                    onChange={handleStoreSettingsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Store Email</Label>
                  <Input
                    id="storeEmail"
                    name="storeEmail"
                    type="email"
                    value={storeSettings.storeEmail}
                    onChange={handleStoreSettingsChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeDescription">Store Description</Label>
                <Textarea
                  id="storeDescription"
                  name="storeDescription"
                  value={storeSettings.storeDescription}
                  onChange={handleStoreSettingsChange}
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Store Phone</Label>
                  <Input
                    id="storePhone"
                    name="storePhone"
                    value={storeSettings.storePhone}
                    onChange={handleStoreSettingsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    name="currency"
                    value={storeSettings.currency}
                    onChange={handleStoreSettingsChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeAddress">Store Address</Label>
                <Textarea
                  id="storeAddress"
                  name="storeAddress"
                  value={storeSettings.storeAddress}
                  onChange={handleStoreSettingsChange}
                  rows={2}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    name="taxRate"
                    type="number"
                    step="0.1"
                    value={storeSettings.taxRate}
                    onChange={handleStoreSettingsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">
                    Free Shipping Threshold (NGN)
                  </Label>
                  <Input
                    id="freeShippingThreshold"
                    name="freeShippingThreshold"
                    type="number"
                    value={storeSettings.freeShippingThreshold}
                    onChange={handleStoreSettingsChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Configuration
              </CardTitle>
              <CardDescription>
                Configure payment methods and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Paystack Integration</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable Paystack payment processing
                  </p>
                </div>
                <Switch
                  checked={paymentSettings.paystackEnabled}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("payment", "paystackEnabled", checked)
                  }
                />
              </div>

              {paymentSettings.paystackEnabled && (
                <div className="space-y-4 border-l-2 border-primary/20 pl-4">
                  <div className="space-y-2">
                    <Label htmlFor="paystackPublicKey">
                      Paystack Public Key
                    </Label>
                    <Input
                      id="paystackPublicKey"
                      name="paystackPublicKey"
                      value={paymentSettings.paystackPublicKey}
                      onChange={handlePaymentSettingsChange}
                      placeholder="pk_test_..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paystackSecretKey">
                      Paystack Secret Key
                    </Label>
                    <Input
                      id="paystackSecretKey"
                      name="paystackSecretKey"
                      type="password"
                      value={paymentSettings.paystackSecretKey}
                      onChange={handlePaymentSettingsChange}
                      placeholder="sk_test_..."
                    />
                    <p className="text-sm text-muted-foreground">
                      Your secret key is encrypted and stored securely
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Configuration
              </CardTitle>
              <CardDescription>
                Configure shipping options and costs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="standardShippingCost">
                    Standard Shipping Cost (KES)
                  </Label>
                  <Input
                    id="standardShippingCost"
                    name="standardShippingCost"
                    type="number"
                    value={shippingSettings.standardShippingCost}
                    onChange={handleShippingSettingsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expressShippingCost">
                    Express Shipping Cost (KES)
                  </Label>
                  <Input
                    id="expressShippingCost"
                    name="expressShippingCost"
                    type="number"
                    value={shippingSettings.expressShippingCost}
                    onChange={handleShippingSettingsChange}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Free Shipping</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable free shipping for orders above threshold
                    </p>
                  </div>
                  <Switch
                    checked={shippingSettings.freeShippingEnabled}
                    onCheckedChange={(checked) =>
                      handleSwitchChange(
                        "shipping",
                        "freeShippingEnabled",
                        checked
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>International Shipping</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow shipping to international destinations
                    </p>
                  </div>
                  <Switch
                    checked={shippingSettings.internationalShipping}
                    onCheckedChange={(checked) =>
                      handleSwitchChange(
                        "shipping",
                        "internationalShipping",
                        checked
                      )
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Notifications
              </CardTitle>
              <CardDescription>
                Configure email notifications and marketing settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Order Confirmation Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Send confirmation emails when orders are placed
                    </p>
                  </div>
                  <Switch
                    checked={emailSettings.orderConfirmationEnabled}
                    onCheckedChange={(checked) =>
                      handleSwitchChange(
                        "email",
                        "orderConfirmationEnabled",
                        checked
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Shipping Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send emails when orders are shipped
                    </p>
                  </div>
                  <Switch
                    checked={emailSettings.shippingNotificationEnabled}
                    onCheckedChange={(checked) =>
                      handleSwitchChange(
                        "email",
                        "shippingNotificationEnabled",
                        checked
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Send promotional and marketing emails
                    </p>
                  </div>
                  <Switch
                    checked={emailSettings.marketingEmailsEnabled}
                    onCheckedChange={(checked) =>
                      handleSwitchChange(
                        "email",
                        "marketingEmailsEnabled",
                        checked
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Newsletter</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable newsletter subscriptions
                    </p>
                  </div>
                  <Switch
                    checked={emailSettings.newsletterEnabled}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("email", "newsletterEnabled", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={loading}>
          {loading ? (
            <>
              <LoadingSpinner />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
