import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/components/auth-provider"
import { CartProvider } from "@/hooks/use-cart"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ECommerce Store",
  description: "Modern ecommerce platform with Firebase and Paystack",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
