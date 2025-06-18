// Force dynamic rendering
export const dynamic = "force-dynamic"
export const revalidate = 0

import CategoryEditForm from "@/components/admin/categories/CategoryEditForm"

interface Props {
  params: {
    id: string
  }
}

const CategoryEditPage = async ({ params }: Props) => {
  const { id } = params

  return (
    <div>
      <CategoryEditForm id={id} />
    </div>
  )
}

export default CategoryEditPage
