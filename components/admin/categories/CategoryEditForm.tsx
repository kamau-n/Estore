"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/loading-spinner"

interface Category {
  id: string
  name: string
  description: string
  image: string
}

interface CategoryEditFormProps {
  categoryId: string
}

export default function CategoryEditForm({ categoryId }: CategoryEditFormProps) {
  const [category, setCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null as File | null,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoryDoc = await getDoc(doc(db, "categories", categoryId))
        if (categoryDoc.exists()) {
          const categoryData = { id: categoryDoc.id, ...categoryDoc.data() } as Category
          setCategory(categoryData)
          setFormData({
            name: categoryData.name,
            description: categoryData.description,
            image: null,
          })
        } else {
          toast({
            title: "Error",
            description: "Category not found",
            variant: "destructive",
          })
          router.push("/admin/categories")
        }
      } catch (error) {
        console.error("Error fetching category:", error)
        toast({
          title: "Error",
          description: "Failed to load category",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [categoryId, router, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({
      ...prev,
      image: file,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      let imageUrl = category?.image || ""

      // Upload new image if provided
      if (formData.image) {
        const imageRef = ref(storage, `categories/${Date.now()}_${formData.image.name}`)
        const snapshot = await uploadBytes(imageRef, formData.image)
        imageUrl = await getDownloadURL(snapshot.ref)
      }

      // Update category document
      await updateDoc(doc(db, "categories", categoryId), {
        name: formData.name,
        description: formData.description,
        image: imageUrl,
        updatedAt: new Date(),
      })

      toast({
        title: "Success",
        description: "Category updated successfully",
      })

      router.push("/admin/categories")
    } catch (error) {
      console.error("Error updating category:", error)
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (!category) {
    return (
      <div className="text-center">
        <p>Category not found</p>
      </div>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Category</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter category name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter category description"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Category Image</Label>
            {category.image && (
              <div className="mb-2">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-32 h-32 object-cover rounded-md"
                />
                <p className="text-sm text-gray-500 mt-1">Current image</p>
              </div>
            )}
            <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
            <p className="text-sm text-gray-500">Leave empty to keep current image</p>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={saving}>
              {saving ? <LoadingSpinner /> : "Update Category"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/admin/categories")}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
