import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Scale, FileText, AlertTriangle, Shield } from "lucide-react"

export const metadata = {
  title: "Terms of Service - EStore",
  description: "Terms and conditions for using our ecommerce platform",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Please read these terms carefully before using our services. By using EStore, you agree to these terms.
        </p>
        <p className="text-sm text-muted-foreground mt-4">Last updated: December 2024</p>
      </div>

      {/* Quick Overview */}
      <div className="mb-12">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Terms Overview
            </CardTitle>
            <CardDescription>Key points about using our service</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Agreement</h4>
                <p className="text-sm text-muted-foreground">By using our site, you agree to these terms</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Protection</h4>
                <p className="text-sm text-muted-foreground">Terms protect both you and us</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Updates</h4>
                <p className="text-sm text-muted-foreground">Terms may be updated periodically</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Acceptance */}
        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              By accessing and using EStore ("the Service"), you accept and agree to be bound by the terms and provision
              of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
            <p className="text-sm text-muted-foreground">
              These terms apply to all visitors, users, and others who access or use the service, including customers,
              merchants, contributors, and users who register for an account.
            </p>
          </CardContent>
        </Card>

        {/* Use of Service */}
        <Card>
          <CardHeader>
            <CardTitle>2. Use of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3">Permitted Use</h4>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• Browse and purchase products for personal use</li>
                <li>• Create and maintain a user account</li>
                <li>• Leave reviews and ratings for products</li>
                <li>• Contact customer support for assistance</li>
                <li>• Subscribe to newsletters and promotional communications</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Prohibited Use</h4>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• Use the service for any unlawful purpose</li>
                <li>• Attempt to gain unauthorized access to our systems</li>
                <li>• Upload malicious code or viruses</li>
                <li>• Impersonate another person or entity</li>
                <li>• Engage in fraudulent activities</li>
                <li>• Scrape or harvest data from our website</li>
                <li>• Resell products without authorization</li>
                <li>• Post false or misleading reviews</li>
                <li>• Interfere with other users' use of the service</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Account Registration */}
        <Card>
          <CardHeader>
            <CardTitle>3. Account Registration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              To access certain features of the service, you may be required to register for an account. You agree to:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground ml-4">
              <li>• Provide accurate, current, and complete information</li>
              <li>• Maintain and update your information to keep it accurate</li>
              <li>• Keep your password secure and confidential</li>
              <li>• Accept responsibility for all activities under your account</li>
              <li>• Notify us immediately of any unauthorized use</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              We reserve the right to suspend or terminate accounts that violate these terms or engage in suspicious
              activity.
            </p>
          </CardContent>
        </Card>

        {/* Products and Orders */}
        <Card>
          <CardHeader>
            <CardTitle>4. Products and Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3">Product Information</h4>
              <p className="text-sm text-muted-foreground">
                We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant that
                product descriptions or other content is accurate, complete, reliable, current, or error-free.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Pricing and Availability</h4>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• Prices are subject to change without notice</li>
                <li>• Product availability is not guaranteed</li>
                <li>• We reserve the right to limit quantities</li>
                <li>• All prices are in Nigerian Naira (NGN)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Order Acceptance</h4>
              <p className="text-sm text-muted-foreground">
                Your order is an offer to purchase products. We reserve the right to accept or decline any order for any
                reason. Order confirmation does not guarantee acceptance.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Terms */}
        <Card>
          <CardHeader>
            <CardTitle>5. Payment Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Payment is processed through Paystack, our secure payment partner. By making a purchase, you agree to:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground ml-4">
              <li>• Provide valid payment information</li>
              <li>• Pay all charges incurred by your account</li>
              <li>• Accept responsibility for all taxes and fees</li>
              <li>• Comply with Paystack's terms of service</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              We reserve the right to refuse or cancel orders if payment cannot be processed or if fraud is suspected.
            </p>
          </CardContent>
        </Card>

        {/* Shipping and Delivery */}
        <Card>
          <CardHeader>
            <CardTitle>6. Shipping and Delivery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Shipping terms and delivery timeframes are estimates only. We are not responsible for delays caused by:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground ml-4">
              <li>• Weather conditions or natural disasters</li>
              <li>• Shipping carrier delays</li>
              <li>• Incorrect or incomplete delivery addresses</li>
              <li>• Customs or import delays</li>
              <li>• Public holidays or strikes</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Risk of loss and title for products pass to you upon delivery to the shipping carrier.
            </p>
          </CardContent>
        </Card>

        {/* Returns and Refunds */}
        <Card>
          <CardHeader>
            <CardTitle>7. Returns and Refunds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Our return policy is detailed on our Returns page. Key points include:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground ml-4">
              <li>• 30-day return window for most items</li>
              <li>• Items must be in original condition</li>
              <li>• Some items are non-returnable</li>
              <li>• Return shipping costs may apply</li>
              <li>• Refunds processed within 6-10 business days</li>
            </ul>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card>
          <CardHeader>
            <CardTitle>8. Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The service and its original content, features, and functionality are owned by EStore and are protected by
              international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p className="text-sm text-muted-foreground">
              You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform,
              republish, download, store, or transmit any of the material on our service without prior written consent.
            </p>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card>
          <CardHeader>
            <CardTitle>9. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm font-medium text-amber-800 mb-2">Important Legal Notice</p>
              <p className="text-sm text-amber-700">
                To the maximum extent permitted by law, EStore shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Our total liability to you for any damages arising from or related to this agreement shall not exceed the
              amount you paid to us in the twelve months preceding the claim.
            </p>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card>
          <CardHeader>
            <CardTitle>10. Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We may terminate or suspend your account and access to the service immediately, without prior notice, for
              conduct that we believe violates these terms or is harmful to other users, us, or third parties.
            </p>
            <p className="text-sm text-muted-foreground">
              You may terminate your account at any time by contacting us. Upon termination, your right to use the
              service will cease immediately.
            </p>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card>
          <CardHeader>
            <CardTitle>11. Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              These terms shall be governed by and construed in accordance with the laws of Nigeria, without regard to
              its conflict of law provisions.
            </p>
            <p className="text-sm text-muted-foreground">
              Any disputes arising from these terms or your use of the service shall be resolved in the courts of Lagos
              State, Nigeria.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card>
          <CardHeader>
            <CardTitle>12. Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We reserve the right to modify these terms at any time. When we make changes, we will:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground ml-4">
              <li>• Post the updated terms on our website</li>
              <li>• Update the "Last updated" date</li>
              <li>• Notify users of material changes via email</li>
              <li>• Provide reasonable notice before changes take effect</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Your continued use of the service after changes constitutes acceptance of the new terms.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>13. Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              If you have questions about these terms, please contact us:
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Email:</strong> legal@estore.com
              </p>
              <p>
                <strong>Phone:</strong> +234 123 456 7890
              </p>
              <p>
                <strong>Address:</strong> 123 Commerce Street, Victoria Island, Lagos, Nigeria
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
