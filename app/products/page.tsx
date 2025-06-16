import { Suspense } from "react"
import { ProductGrid } from "@/components/product-grid"
import { CategoryFilter } from "@/components/category-filter"
import { LoadingSpinner } from "@/components/loading-spinner"

export const metadata = {
  title: "Products - EStore",
  description: "Browse our complete collection of products",
}

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">All Products</h1>
        <p className="text-muted-foreground">Discover our complete collection of quality products at amazing prices.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64">
          <Suspense fallback={<LoadingSpinner />}>
            <CategoryFilter />
          </Suspense>
        </aside>

        <main className="flex-1">
          <Suspense fallback={<LoadingSpinner />}>
            <ProductGrid />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
