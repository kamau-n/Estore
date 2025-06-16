import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShoppingBag, Star, Users } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                Shop the Latest
                <span className="text-primary block">Trends & Styles</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Discover amazing products at unbeatable prices. From fashion to electronics, we have everything you
                need.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/categories">Browse Categories</Link>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">4.9/5 rating</span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">10k+ customers</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-6 flex items-center justify-center">
                  <ShoppingBag className="h-12 w-12 text-white" />
                </div>
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-green-500 to-teal-600"></div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-orange-500 to-red-600"></div>
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600"></div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-background border rounded-lg p-3 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-xs font-medium">Free Shipping</span>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-background border rounded-lg p-3 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs font-medium">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
