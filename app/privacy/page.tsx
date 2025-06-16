import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, Users, Database, Globe } from "lucide-react"

export const metadata = {
  title: "Privacy Policy - EStore",
  description: "Learn how we collect, use, and protect your personal information",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your privacy is important to us. This policy explains how we collect, use, and protect your personal
          information.
        </p>
        <p className="text-sm text-muted-foreground mt-4">Last updated: December 2024</p>
      </div>

      {/* Quick Overview */}
      <div className="mb-12">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Privacy at a Glance
            </CardTitle>
            <CardDescription>Here's what you need to know about how we handle your data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Secure</h4>
                <p className="text-sm text-muted-foreground">Your data is encrypted and stored securely</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Transparent</h4>
                <p className="text-sm text-muted-foreground">We're clear about what data we collect and why</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Your Control</h4>
                <p className="text-sm text-muted-foreground">You can access, update, or delete your data anytime</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3">Personal Information</h4>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• Name, email address, and phone number</li>
                <li>• Shipping and billing addresses</li>
                <li>• Payment information (processed securely by Paystack)</li>
                <li>• Account credentials and preferences</li>
                <li>• Communication history with our support team</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Automatically Collected Information</h4>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• Device information (browser, operating system, device type)</li>
                <li>• IP address and location data</li>
                <li>• Website usage patterns and preferences</li>
                <li>• Cookies and similar tracking technologies</li>
                <li>• Shopping behavior and product interactions</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Information from Third Parties</h4>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• Social media profile information (when you sign in with social accounts)</li>
                <li>• Payment verification data from Paystack</li>
                <li>• Shipping updates from delivery partners</li>
                <li>• Marketing analytics from advertising platforms</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3">To Provide Our Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• Process and fulfill your orders</li>
                <li>• Handle payments and prevent fraud</li>
                <li>• Provide customer support and respond to inquiries</li>
                <li>• Send order confirmations and shipping updates</li>
                <li>• Maintain and improve our website functionality</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">To Improve Your Experience</h4>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• Personalize product recommendations</li>
                <li>• Remember your preferences and shopping cart</li>
                <li>• Analyze website usage to improve our services</li>
                <li>• Conduct research and analytics</li>
                <li>• Test new features and functionality</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">To Communicate With You</h4>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• Send promotional emails and newsletters (with your consent)</li>
                <li>• Notify you about sales, new products, and special offers</li>
                <li>• Provide important account and service updates</li>
                <li>• Respond to your questions and feedback</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Information Sharing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              How We Share Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-800 mb-2">We Never Sell Your Personal Information</p>
              <p className="text-sm text-green-700">
                We do not sell, rent, or trade your personal information to third parties for their marketing purposes.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">We May Share Information With:</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <strong>Service Providers:</strong> Payment processors (Paystack), shipping companies, email service
                  providers, and analytics tools that help us operate our business
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights and
                  the safety of our users
                </li>
                <li>
                  <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of our business
                  assets
                </li>
                <li>
                  <strong>With Your Consent:</strong> When you explicitly agree to share information with third parties
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground ml-4">
              <li>• SSL encryption for all data transmission</li>
              <li>• Secure servers with regular security updates</li>
              <li>• PCI DSS compliant payment processing</li>
              <li>• Regular security audits and monitoring</li>
              <li>• Limited access to personal data on a need-to-know basis</li>
              <li>• Secure backup and disaster recovery procedures</li>
            </ul>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mt-4">
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> While we use industry-standard security measures, no method of transmission
                over the internet is 100% secure. We cannot guarantee absolute security of your information.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Your Privacy Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">You have the following rights regarding your personal data:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium">Access</h5>
                  <p className="text-sm text-muted-foreground">Request a copy of your personal data</p>
                </div>
                <div>
                  <h5 className="font-medium">Correction</h5>
                  <p className="text-sm text-muted-foreground">Update or correct inaccurate information</p>
                </div>
                <div>
                  <h5 className="font-medium">Deletion</h5>
                  <p className="text-sm text-muted-foreground">Request deletion of your personal data</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium">Portability</h5>
                  <p className="text-sm text-muted-foreground">Export your data in a readable format</p>
                </div>
                <div>
                  <h5 className="font-medium">Opt-out</h5>
                  <p className="text-sm text-muted-foreground">Unsubscribe from marketing communications</p>
                </div>
                <div>
                  <h5 className="font-medium">Restriction</h5>
                  <p className="text-sm text-muted-foreground">Limit how we process your data</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              To exercise these rights, please contact us at privacy@estore.com or through your account settings.
            </p>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card>
          <CardHeader>
            <CardTitle>Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We use cookies and similar technologies to enhance your browsing experience:
            </p>
            <div className="space-y-3">
              <div>
                <h5 className="font-medium">Essential Cookies</h5>
                <p className="text-sm text-muted-foreground">
                  Required for basic website functionality, shopping cart, and security
                </p>
              </div>
              <div>
                <h5 className="font-medium">Performance Cookies</h5>
                <p className="text-sm text-muted-foreground">
                  Help us understand how visitors interact with our website
                </p>
              </div>
              <div>
                <h5 className="font-medium">Marketing Cookies</h5>
                <p className="text-sm text-muted-foreground">
                  Used to deliver relevant advertisements and track campaign effectiveness
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              You can control cookies through your browser settings, but disabling certain cookies may affect website
              functionality.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Us About Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              If you have questions about this privacy policy or how we handle your data, please contact us:
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Email:</strong> privacy@estore.com
              </p>
              <p>
                <strong>Phone:</strong> +234 123 456 7890
              </p>
              <p>
                <strong>Address:</strong> 123 Commerce Street, Victoria Island, Lagos, Nigeria
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              We will respond to your privacy-related inquiries within 30 days.
            </p>
          </CardContent>
        </Card>

        {/* Updates */}
        <Card>
          <CardHeader>
            <CardTitle>Policy Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We may update this privacy policy from time to time to reflect changes in our practices or legal
              requirements. When we make significant changes, we will:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground ml-4 mt-3">
              <li>• Post the updated policy on our website</li>
              <li>• Update the "Last updated" date at the top of this page</li>
              <li>• Send you an email notification for material changes</li>
              <li>• Provide a summary of key changes</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              Your continued use of our services after policy updates constitutes acceptance of the revised policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
