"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Upload, X } from "lucide-react"
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

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [originalImage, setOriginalImage] = useState<string | null>(null)

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

        if (categoryData.image) {
          setOriginalImage(categoryData.image)
          setImagePreview(categoryData.image)
        }
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        })
        return
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Please select a valid image file",
          variant: "destructive",
        })
        return
      }

      setImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
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
        image: imagePreview || null,
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

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">Category Image</Label>
                <div className="flex items-center gap-4">
                  <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image")?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {imagePreview ? "Change Image" : "Upload Image"}
                  </Button>
                  <p className="text-sm text-muted-foreground">Max 5MB, JPG/PNG/GIF supported</p>
                </div>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="space-y-2">
                  <Label>Image Preview</Label>
                  <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Category preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={removeImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
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
