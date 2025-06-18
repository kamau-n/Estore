"use client"

import type React from "react"

import { ShoppingCart, Menu } from "lucide-react"
import { User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface NavbarProps {
  user: any | null // Replace 'any' with your actual user type
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-white border-b">
      <div className="flex h-16 items-center px-4">
        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="py-4">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold hover:bg-accent rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/cart"
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent rounded-md"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingCart className="h-4 w-4" />
                Cart
              </Link>
              {user && (
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="ml-4 font-bold text-xl">
          My Store
        </Link>

        {/* Desktop Navigation */}
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/products">Products</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cart" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Cart
            </Link>
          </Button>
          {user && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
