import { Suspense } from "react"
import { ProductGrid } from "@/components/product-grid"
import { CategoryFilter } from "@/components/category-filter"
import { HeroSection } from "@/components/hero-section"
import { LoadingSpinner } from "@/components/loading-spinner"
import { FirebaseConfigNotice } from "@/components/firebase-config-notice"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <FirebaseConfigNotice />
      <HeroSection />

      <div className="container mx-auto px-4 py-8">
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
    </div>
  )
}
