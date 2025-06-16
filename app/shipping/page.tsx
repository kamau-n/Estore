import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Clock, MapPin, Package, Shield, AlertCircle } from "lucide-react"

export const metadata = {
  title: "Shipping Information - EStore",
  description: "Learn about our shipping options, delivery times, and policies",
}

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Shipping Information</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know about our shipping options, delivery times, and policies
        </p>
      </div>

      {/* Shipping Options */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Shipping Options</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  <CardTitle>Standard Shipping</CardTitle>
                </div>
                <Badge variant="secondary">Most Popular</Badge>
              </div>
              <CardDescription>Reliable delivery for everyday orders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Delivery Time:</span>
                <span className="font-medium">3-5 business days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cost:</span>
                <span className="font-medium">₦2,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Free Shipping:</span>
                <span className="font-medium">Orders over ₦10,000</span>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  Perfect for regular orders. Tracking included with all shipments.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <CardTitle>Express Shipping</CardTitle>
                </div>
                <Badge variant="destructive">Fast</Badge>
              </div>
              <CardDescription>Quick delivery when you need it fast</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Delivery Time:</span>
                <span className="font-medium">1-2 business days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cost:</span>
                <span className="font-medium">₦5,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cutoff Time:</span>
                <span className="font-medium">2:00 PM same day</span>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  Priority handling and expedited delivery. Real-time tracking included.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delivery Areas */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Delivery Areas</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Coverage Areas
            </CardTitle>
            <CardDescription>We currently deliver to the following locations in Nigeria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-primary">Lagos State</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Victoria Island</li>
                  <li>• Ikoyi</li>
                  <li>• Lekki</li>
                  <li>• Ikeja</li>
                  <li>• Surulere</li>
                  <li>• Yaba</li>
                  <li>• Mainland areas</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-primary">Abuja (FCT)</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Central Business District</li>
                  <li>• Garki</li>
                  <li>• Wuse</li>
                  <li>• Maitama</li>
                  <li>• Asokoro</li>
                  <li>• Gwarinpa</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-primary">Other Major Cities</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Port Harcourt</li>
                  <li>• Kano</li>
                  <li>• Ibadan</li>
                  <li>• Benin City</li>
                  <li>• Enugu</li>
                  <li>• Kaduna</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Note:</strong> Delivery times may vary for locations outside Lagos and Abuja. Additional 1-2
                days may be required for remote areas.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Processing & Handling */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Order Processing</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Processing Time
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Order Confirmation</span>
                  <Badge variant="outline">Immediate</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Payment Processing</span>
                  <Badge variant="outline">1-2 hours</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Order Preparation</span>
                  <Badge variant="outline">1-2 business days</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Dispatch</span>
                  <Badge variant="outline">Within 24 hours</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Packaging & Handling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Secure packaging to prevent damage</li>
                <li>• Eco-friendly materials when possible</li>
                <li>• Fragile items receive extra protection</li>
                <li>• Discreet packaging for privacy</li>
                <li>• Quality control before dispatch</li>
                <li>• Insurance coverage included</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tracking */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Order Tracking</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Order Placed</h4>
                <p className="text-sm text-muted-foreground">Your order has been received and is being processed</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Processing</h4>
                <p className="text-sm text-muted-foreground">Your items are being prepared for shipment</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Shipped</h4>
                <p className="text-sm text-muted-foreground">Your order is on its way to you</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Delivered</h4>
                <p className="text-sm text-muted-foreground">Your order has been delivered successfully</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Important Notes */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Important Information</h2>
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-2">Delivery Attempts</h4>
                  <p className="text-sm text-muted-foreground">
                    Our delivery partners will make up to 3 delivery attempts. If unsuccessful, the package will be held
                    at the nearest pickup location for 7 days before being returned to us.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-2">Address Accuracy</h4>
                  <p className="text-sm text-muted-foreground">
                    Please ensure your delivery address is complete and accurate. Incorrect addresses may result in
                    delivery delays or additional charges for address corrections.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-2">Weather & Holidays</h4>
                  <p className="text-sm text-muted-foreground">
                    Delivery times may be extended during severe weather conditions, public holidays, or peak shopping
                    seasons. We'll keep you updated on any delays.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
