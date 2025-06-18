// Force dynamic rendering
export const dynamic = "force-dynamic"
export const revalidate = 0

import CategoryForm from "@/components/admin/CategoryForm"

export default function NewCategoryPage() {
  return (
    <div>
      <CategoryForm />
    </div>
  )
}
