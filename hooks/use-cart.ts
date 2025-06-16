"use client"

import React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  category: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { user } = useAuth()

  // Load cart from localStorage or Firebase
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        // Load from Firebase for authenticated users
        try {
          const cartDoc = await getDoc(doc(db, "carts", user.uid))
          if (cartDoc.exists()) {
            setItems(cartDoc.data().items || [])
          }
        } catch (error) {
          console.error("Error loading cart from Firebase:", error)
          // Fallback to localStorage
          const savedCart = localStorage.getItem("cart")
          if (savedCart) {
            setItems(JSON.parse(savedCart))
          }
        }
      } else {
        // Load from localStorage for guest users
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
          try {
            setItems(JSON.parse(savedCart))
          } catch (error) {
            console.error("Error parsing cart from localStorage:", error)
            setItems([])
          }
        }
      }
    }

    loadCart()
  }, [user])

  // Save cart to localStorage or Firebase
  useEffect(() => {
    const saveCart = async () => {
      if (user) {
        // Save to Firebase for authenticated users
        try {
          await setDoc(doc(db, "carts", user.uid), { items })
        } catch (error) {
          console.error("Error saving cart to Firebase:", error)
          // Fallback to localStorage
          localStorage.setItem("cart", JSON.stringify(items))
        }
      } else {
        // Save to localStorage for guest users
        localStorage.setItem("cart", JSON.stringify(items))
      }
    }

    if (items.length > 0 || user) {
      saveCart()
    }
  }, [items, user])

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === newItem.id)

      if (existingItem) {
        return currentItems.map((item) => (item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item))
      }

      return [...currentItems, { ...newItem, quantity: 1 }]
    })
  }

  const removeItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems((currentItems) => currentItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount,
  }

  return React.createElement(CartContext.Provider, { value }, children)
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
