import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, HelpCircle, ShoppingCart, CreditCard, Truck, RotateCcw, Phone } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Help Center - EStore",
  description: "Find answers to frequently asked questions and get help with your orders",
}

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Help Center</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find answers to your questions or get in touch with our support team
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search for help..." className="pl-10" />
        </div>
      </div>

      {/* Quick Help Categories */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <ShoppingCart className="h-8 w-8 mx-auto text-primary mb-2" />
            <CardTitle className="text-lg">Orders</CardTitle>
            <CardDescription>Track orders, modify, or cancel</CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <Truck className="h-8 w-8 mx-auto text-primary mb-2" />
            <CardTitle className="text-lg">Shipping</CardTitle>
            <CardDescription>Delivery times and shipping info</CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <RotateCcw className="h-8 w-8 mx-auto text-primary mb-2" />
            <CardTitle className="text-lg">Returns</CardTitle>
            <CardDescription>Return policy and process</CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CreditCard className="h-8 w-8 mx-auto text-primary mb-2" />
            <CardTitle className="text-lg">Payments</CardTitle>
            <CardDescription>Payment methods and billing</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

        <Accordion type="single" collapsible className="space-y-4">
          {/* Orders */}
          <AccordionItem value="order-1">
            <AccordionTrigger>How can I track my order?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-4">
                Once your order is shipped, you'll receive a tracking number via email. You can track your order by:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Clicking the tracking link in your shipping confirmation email</li>
                <li>Logging into your account and viewing your order history</li>
                <li>Using the tracking number on our shipping partner's website</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="order-2">
            <AccordionTrigger>Can I modify or cancel my order?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-4">
                You can modify or cancel your order within 1 hour of placing it, provided it hasn't been processed yet.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Log into your account and go to "My Orders"</li>
                <li>Find the order you want to modify or cancel</li>
                <li>Click "Modify" or "Cancel" if the option is available</li>
                <li>If these options aren't available, contact our support team immediately</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Shipping */}
          <AccordionItem value="shipping-1">
            <AccordionTrigger>What are your shipping options and costs?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>We offer several shipping options:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold">Standard Shipping</h4>
                    <p className="text-sm text-muted-foreground">3-5 business days</p>
                    <p className="font-medium">₦2,000 (Free on orders over ₦10,000)</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold">Express Shipping</h4>
                    <p className="text-sm text-muted-foreground">1-2 business days</p>
                    <p className="font-medium">₦5,000</p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="shipping-2">
            <AccordionTrigger>Do you ship internationally?</AccordionTrigger>
            <AccordionContent>
              <p>
                Currently, we only ship within Nigeria. We're working on expanding our shipping to other countries in
                West Africa. Sign up for our newsletter to be notified when international shipping becomes available.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* Returns */}
          <AccordionItem value="returns-1">
            <AccordionTrigger>What is your return policy?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>We offer a 30-day return policy for most items:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Items must be in original condition with tags attached</li>
                  <li>Original packaging and receipt required</li>
                  <li>Some items like underwear, swimwear, and personalized items cannot be returned</li>
                  <li>Return shipping costs are covered by us for defective items</li>
                </ul>
                <p>
                  <Link href="/returns" className="text-primary hover:underline">
                    View our complete return policy →
                  </Link>
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Payments */}
          <AccordionItem value="payment-1">
            <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-4">We accept the following payment methods through Paystack:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Visa and Mastercard credit/debit cards</li>
                <li>Verve cards</li>
                <li>Bank transfers</li>
                <li>USSD payments</li>
                <li>Mobile money (MTN, Airtel, etc.)</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                All payments are processed securely through Paystack's encrypted payment system.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="payment-2">
            <AccordionTrigger>Is my payment information secure?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-4">
                Yes, your payment information is completely secure. We use Paystack, a PCI DSS compliant payment
                processor that encrypts all sensitive data.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>We never store your card details on our servers</li>
                <li>All transactions are encrypted with SSL technology</li>
                <li>Paystack is certified by major card networks</li>
                <li>We comply with international security standards</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Account */}
          <AccordionItem value="account-1">
            <AccordionTrigger>How do I create an account?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-4">Creating an account is quick and easy:</p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Click "Sign Up" in the top right corner</li>
                <li>Choose to sign up with email or social media (Google, Facebook, Twitter)</li>
                <li>Fill in your details and verify your email</li>
                <li>Start shopping with faster checkout and order tracking</li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="account-2">
            <AccordionTrigger>I forgot my password. How do I reset it?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-4">To reset your password:</p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Go to the sign-in page</li>
                <li>Click "Forgot password?"</li>
                <li>Enter your email address</li>
                <li>Check your email for a password reset link</li>
                <li>Follow the instructions to create a new password</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Contact Support */}
      <div className="mt-16">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <HelpCircle className="h-12 w-12 mx-auto text-primary mb-4" />
            <CardTitle>Still Need Help?</CardTitle>
            <CardDescription>Our support team is here to help you with any questions or concerns.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/contact">
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="mailto:support@estore.com">Email Us</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Average response time: 2-4 hours during business hours</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
