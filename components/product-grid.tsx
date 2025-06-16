"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, orderBy, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ProductCard } from "@/components/product-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useSearchParams } from "next/navigation"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  inStock: boolean
  featured: boolean
  createdAt: string
}

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get("category")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let q = query(collection(db, "products"), orderBy("createdAt", "desc"))

        if (categoryFilter && categoryFilter !== "all") {
          q = query(collection(db, "products"), where("category", "==", categoryFilter), orderBy("createdAt", "desc"))
        }

        const querySnapshot = await getDocs(q)
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[]

        setProducts(productsData)
      } catch (error) {
        console.error("Error fetching products:", error)
        // If no products exist, show empty state
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [categoryFilter])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-muted-foreground">No products found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {categoryFilter ? `No products in "${categoryFilter}" category` : "Add some products to get started!"}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
