import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, CheckCircle, XCircle, Clock, Package, AlertTriangle } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Returns & Refunds - EStore",
  description: "Learn about our return policy, process, and how to return items",
}

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Returns & Refunds</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We want you to be completely satisfied with your purchase. Learn about our hassle-free return process.
        </p>
      </div>

      {/* Return Policy Overview */}
      <div className="mb-12">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-primary" />
              30-Day Return Policy
            </CardTitle>
            <CardDescription>
              We offer a generous 30-day return window for most items, no questions asked.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">30 Days</h4>
                <p className="text-sm text-muted-foreground">From delivery date to initiate return</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Original Condition</h4>
                <p className="text-sm text-muted-foreground">Items must be unused with tags attached</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RotateCcw className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Free Returns</h4>
                <p className="text-sm text-muted-foreground">We cover return shipping for defective items</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* What Can Be Returned */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">What Can Be Returned</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Returnable Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Clothing with original tags
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Shoes in original box
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Electronics in original packaging
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Home & garden items (unused)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Books and media
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Accessories and jewelry
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                Non-Returnable Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  Underwear and intimate apparel
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  Swimwear and activewear
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  Personalized or custom items
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  Perishable goods
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  Digital downloads
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  Items damaged by misuse
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Return Process */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">How to Return an Item</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-primary">1</span>
              </div>
              <CardTitle className="text-lg">Initiate Return</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Log into your account and go to "My Orders" to start the return process
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-primary">2</span>
              </div>
              <CardTitle className="text-lg">Print Label</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Download and print the prepaid return shipping label we provide
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-primary">3</span>
              </div>
              <CardTitle className="text-lg">Package Item</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Securely package the item in its original packaging with all accessories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-primary">4</span>
              </div>
              <CardTitle className="text-lg">Ship Back</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Drop off at any authorized shipping location or schedule a pickup
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Refund Information */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Refund Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Refund Timeline</CardTitle>
              <CardDescription>How long it takes to process your refund</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Item Received</span>
                <Badge variant="outline">1-2 business days</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Quality Check</span>
                <Badge variant="outline">1-2 business days</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Refund Processed</span>
                <Badge variant="outline">1 business day</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Bank Processing</span>
                <Badge variant="outline">3-5 business days</Badge>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center font-medium">
                  <span>Total Time</span>
                  <Badge>6-10 business days</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Refund Methods</CardTitle>
              <CardDescription>How you'll receive your refund</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Original Payment Method</p>
                    <p className="text-sm text-muted-foreground">Refunded to the card/account used for purchase</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Store Credit</p>
                    <p className="text-sm text-muted-foreground">Instant credit for future purchases (optional)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Bank Transfer</p>
                    <p className="text-sm text-muted-foreground">Direct transfer to your bank account</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Special Circumstances */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Special Circumstances</h2>
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-2">Defective or Damaged Items</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    If you receive a defective or damaged item, we'll provide a full refund plus return shipping costs.
                    Contact us immediately with photos of the damage.
                  </p>
                  <Button size="sm" asChild>
                    <Link href="/contact">Report Damaged Item</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-2">Wrong Item Received</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    If we sent you the wrong item, we'll arrange for immediate exchange at no cost to you. We'll also
                    expedite shipping of the correct item.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-2">Late Returns</h4>
                  <p className="text-sm text-muted-foreground">
                    Returns initiated after 30 days may be accepted on a case-by-case basis, subject to a restocking
                    fee. Contact our customer service team to discuss your situation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact for Returns */}
      <div>
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Need Help with a Return?</CardTitle>
            <CardDescription>
              Our customer service team is here to assist you with any return questions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/help">Visit Help Center</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Email: returns@estore.com | Phone: +234 123 456 7890</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
