"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Package, Eye } from "lucide-react"
import Link from "next/link"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  inStock: boolean
  stockQuantity: number
  featured: boolean
  createdAt: string
  updatedAt: string
}

export default function ProductsManagementPage() {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/")
      return
    }
  }, [user, isAdmin, authLoading, router])

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user || !isAdmin) return

      try {
        const productsSnapshot = await getDocs(collection(db, "products"))
        const productsData = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[]

        setProducts(productsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      } catch (error) {
        console.error("Error fetching products:", error)
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [user, isAdmin, toast])

  const handleDeleteProduct = async (productId: string) => {
    setDeletingId(productId)
    try {
      await deleteDoc(doc(db, "products", productId))
      setProducts(products.filter((product) => product.id !== productId))
      toast({
        title: "Success",
        description: "Product deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price)
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>

        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{searchTerm ? "No products found" : "No products yet"}</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Create your first product to start selling"}
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link href="/admin/products/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <div className="relative aspect-square overflow-hidden rounded-t-lg">
                <Image
                  src={product.image || "/placeholder.svg?height=300&width=300"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.featured && (
                  <Badge className="absolute top-2 left-2" variant="secondary">
                    Featured
                  </Badge>
                )}
                {!product.inStock && (
                  <Badge className="absolute top-2 right-2" variant="destructive">
                    Out of Stock
                  </Badge>
                )}
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">{product.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{product.category}</Badge>
                  <span className="font-bold text-lg">{formatPrice(product.price)}</span>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-muted-foreground">Stock: {product.stockQuantity || 0}</div>
                  <div className="text-sm text-muted-foreground">{product.inStock ? "In Stock" : "Out of Stock"}</div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" asChild className="flex-1">
                    <Link href={`/products/${product.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </Button>

                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{product.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteProduct(product.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          disabled={deletingId === product.id}
                        >
                          {deletingId === product.id ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{products.length}</div>
            <div className="text-sm text-muted-foreground">Total Products</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{products.filter((p) => p.inStock).length}</div>
            <div className="text-sm text-muted-foreground">In Stock</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{products.filter((p) => p.featured).length}</div>
            <div className="text-sm text-muted-foreground">Featured</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {formatPrice(products.reduce((sum, p) => sum + p.price, 0) / products.length || 0)}
            </div>
            <div className="text-sm text-muted-foreground">Avg. Price</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
