"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingCart, User, Menu, Search, Settings, LogOut, Package } from "lucide-react"
import { Input } from "@/components/ui/input"
import { CartSheet } from "@/components/cart-sheet"

export function Navbar() {
  const { user, signOut, isAdmin } = useAuth()
  const { items } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Package className="h-6 w-6" />
            <span className="font-bold text-xl">EStore</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="text-sm font-medium hover:text-primary">
              Products
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-primary">
              Categories
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary">
              Contact
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search products..." className="pl-8" />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.displayName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">
                      <Package className="mr-2 h-4 w-4" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-6">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search products..." className="pl-8" />
                  </div>

                  <nav className="flex flex-col space-y-2">
                    <Link
                      href="/products"
                      className="text-sm font-medium hover:text-primary p-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Products
                    </Link>
                    <Link
                      href="/categories"
                      className="text-sm font-medium hover:text-primary p-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Categories
                    </Link>
                    <Link
                      href="/about"
                      className="text-sm font-medium hover:text-primary p-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      About
                    </Link>
                    <Link
                      href="/contact"
                      className="text-sm font-medium hover:text-primary p-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Contact
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Cart Sheet */}
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </header>
  )
}
