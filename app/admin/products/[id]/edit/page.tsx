"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { doc, getDoc, updateDoc, getDocs, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/loading-spinner"

interface Category {
  id: string
  name: string
}

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    categoryId: "",
    inStock: true,
    stockQuantity: "",
    featured: false,
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !isAdmin) return

      try {
        // Fetch categories
        const categoriesSnapshot = await getDocs(collection(db, "categories"))
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        })) as Category[]
        setCategories(categoriesData)

        // Fetch product
        const productDoc = await getDoc(doc(db, "products", params.id))

        if (!productDoc.exists()) {
          toast({
            title: "Error",
            description: "Product not found",
            variant: "destructive",
          })
          router.push("/admin/products")
          return
        }

        const productData = productDoc.data()
        setFormData({
          name: productData.name || "",
          description: productData.description || "",
          price: productData.price?.toString() || "",
          image: productData.image || "",
          category: productData.category || "",
          categoryId: productData.categoryId || "",
          inStock: productData.inStock ?? true,
          stockQuantity: productData.stockQuantity?.toString() || "",
          featured: productData.featured ?? false,
        })
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load product",
          variant: "destructive",
        })
        router.push("/admin/products")
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      fetchData()
    }
  }, [user, isAdmin, authLoading, params.id, router, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleCategoryChange = (value: string) => {
    const selectedCategory = categories.find((cat) => cat.id === value)
    setFormData((prev) => ({
      ...prev,
      categoryId: value,
      category: selectedCategory?.name || "",
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !isAdmin) {
      toast({
        title: "Error",
        description: "You don't have permission to edit products",
        variant: "destructive",
      })
      return
    }

    // Validation
    if (!formData.name.trim() || !formData.price || !formData.categoryId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const price = Number.parseFloat(formData.price)
    const stockQuantity = Number.parseInt(formData.stockQuantity) || 0

    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: price,
        image: formData.image.trim() || null,
        category: formData.category,
        categoryId: formData.categoryId,
        inStock: formData.inStock,
        stockQuantity: stockQuantity,
        featured: formData.featured,
        updatedAt: new Date().toISOString(),
      }

      await updateDoc(doc(db, "products", params.id), productData)

      toast({
        title: "Success",
        description: "Product updated successfully!",
      })

      router.push("/admin/products")
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user || !isAdmin) {
    router.push("/")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>

        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">Update the product information</p>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Update the details for this product</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your product..."
                  rows={4}
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price (NGN) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.categoryId} onValueChange={handleCategoryChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="image">Product Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/product-image.jpg"
                />
              </div>

              {/* Image Preview */}
              {formData.image && (
                <div className="space-y-2">
                  <Label>Image Preview</Label>
                  <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                    <img
                      src={formData.image || "/placeholder.svg"}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Stock Quantity */}
              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input
                  id="stockQuantity"
                  name="stockQuantity"
                  type="number"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>

              {/* Switches */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="inStock">In Stock</Label>
                    <p className="text-sm text-muted-foreground">Is this product available for purchase?</p>
                  </div>
                  <Switch
                    id="inStock"
                    checked={formData.inStock}
                    onCheckedChange={(checked) => handleSwitchChange("inStock", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="featured">Featured Product</Label>
                    <p className="text-sm text-muted-foreground">Highlight this product on the homepage</p>
                  </div>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <LoadingSpinner />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>

                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/products">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
