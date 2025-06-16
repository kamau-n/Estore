import { Suspense } from "react"
import { CategoriesGrid } from "@/components/categories-grid"
import { LoadingSpinner } from "@/components/loading-spinner"

export const metadata = {
  title: "Categories - EStore",
  description: "Browse all product categories in our store",
}

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Product Categories</h1>
        <p className="text-muted-foreground">
          Explore our wide range of product categories and find exactly what you're looking for.
        </p>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <CategoriesGrid />
      </Suspense>
    </div>
  )
}
