"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { addDoc, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function NewCategoryPage() {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !isAdmin) {
      toast({
        title: "Error",
        description: "You don't have permission to create categories",
        variant: "destructive",
      })
      return
    }

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        image: formData.image.trim() || null,
        productCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await addDoc(collection(db, "categories"), categoryData)

      toast({
        title: "Success",
        description: "Category created successfully!",
      })

      router.push("/admin/categories")
    } catch (error) {
      console.error("Error creating category:", error)
      toast({
        title: "Error",
        description: "Failed to create category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
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
          <Link href="/admin/categories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Link>
        </Button>

        <h1 className="text-3xl font-bold">Create New Category</h1>
        <p className="text-muted-foreground">Add a new product category to organize your inventory</p>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Category Information</CardTitle>
            <CardDescription>Enter the details for your new category</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Electronics, Clothing, Books"
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
                  placeholder="Describe what products belong in this category..."
                  rows={4}
                />
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="image">Category Image URL (Optional)</Label>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/category-image.jpg"
                />
                <p className="text-sm text-muted-foreground">
                  Add an image URL to represent this category. Leave empty to use a default icon.
                </p>
              </div>

              {/* Image Preview */}
              {formData.image && (
                <div className="space-y-2">
                  <Label>Image Preview</Label>
                  <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                    <img
                      src={formData.image || "/placeholder.svg"}
                      alt="Category preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <LoadingSpinner />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create Category
                    </>
                  )}
                </Button>

                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/categories">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Tips for Creating Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div>
              <strong>Keep it simple:</strong> Use clear, descriptive names that customers will understand
            </div>
            <div>
              <strong>Be specific:</strong> Avoid overly broad categories that might confuse shoppers
            </div>
            <div>
              <strong>Think hierarchy:</strong> Consider how this category fits with your other categories
            </div>
            <div>
              <strong>Use good images:</strong> High-quality category images help customers navigate your store
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
