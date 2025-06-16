"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Package } from "lucide-react"
import Link from "next/link"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"
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

interface Category {
  id: string
  name: string
  description: string
  image?: string
  productCount: number
  createdAt: string
  updatedAt: string
}

export default function CategoriesManagementPage() {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
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
    const fetchCategories = async () => {
      if (!user || !isAdmin) return

      try {
        const categoriesSnapshot = await getDocs(collection(db, "categories"))
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[]

        setCategories(categoriesData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [user, isAdmin, toast])

  const handleDeleteCategory = async (categoryId: string) => {
    setDeletingId(categoryId)
    try {
      await deleteDoc(doc(db, "categories", categoryId))
      setCategories(categories.filter((cat) => cat.id !== categoryId))
      toast({
        title: "Success",
        description: "Category deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
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
          <h1 className="text-3xl font-bold">Category Management</h1>
          <p className="text-muted-foreground">Manage your product categories</p>
        </div>

        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{searchTerm ? "No categories found" : "No categories yet"}</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Create your first category to organize your products"}
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link href="/admin/categories/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">{category.description}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {category.productCount || 0}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Created: {new Date(category.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/categories/${category.id}/edit`}>
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
                          <AlertDialogTitle>Delete Category</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{category.name}"? This action cannot be undone.
                            {category.productCount > 0 && (
                              <span className="block mt-2 text-amber-600">
                                Warning: This category has {category.productCount} products associated with it.
                              </span>
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCategory(category.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={deletingId === category.id}
                          >
                            {deletingId === category.id ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{categories.length}</div>
            <div className="text-sm text-muted-foreground">Total Categories</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Products</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{categories.filter((cat) => (cat.productCount || 0) > 0).length}</div>
            <div className="text-sm text-muted-foreground">Active Categories</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
