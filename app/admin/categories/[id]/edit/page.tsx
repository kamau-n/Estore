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
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/loading-spinner"

interface EditCategoryPageProps {
  params: {
    id: string
  }
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  })

  useEffect(() => {
    const fetchCategory = async () => {
      if (!user || !isAdmin) return

      try {
        const categoryDoc = await getDoc(doc(db, "categories", params.id))

        if (!categoryDoc.exists()) {
          toast({
            title: "Error",
            description: "Category not found",
            variant: "destructive",
          })
          router.push("/admin/categories")
          return
        }

        const categoryData = categoryDoc.data()
        setFormData({
          name: categoryData.name || "",
          description: categoryData.description || "",
          image: categoryData.image || "",
        })
      } catch (error) {
        console.error("Error fetching category:", error)
        toast({
          title: "Error",
          description: "Failed to load category",
          variant: "destructive",
        })
        router.push("/admin/categories")
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      fetchCategory()
    }
  }, [user, isAdmin, authLoading, params.id, router, toast])

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
        description: "You don't have permission to edit categories",
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

    setSaving(true)

    try {
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        image: formData.image.trim() || null,
        updatedAt: new Date().toISOString(),
      }

      await updateDoc(doc(db, "categories", params.id), categoryData)

      toast({
        title: "Success",
        description: "Category updated successfully!",
      })

      router.push("/admin/categories")
    } catch (error) {
      console.error("Error updating category:", error)
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
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
          <Link href="/admin/categories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Link>
        </Button>

        <h1 className="text-3xl font-bold">Edit Category</h1>
        <p className="text-muted-foreground">Update the category information</p>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Category Information</CardTitle>
            <CardDescription>Update the details for this category</CardDescription>
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
                  <Link href="/admin/categories">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
