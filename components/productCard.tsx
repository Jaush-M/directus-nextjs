import Image from 'next/image'
import Link from 'next/link'
import { CategoriesID } from '../interfaces/product.interface'

const assetsAPI = process.env.NEXT_PUBLIC_ASSETS_ENDPOINT

interface ProductCardProps {
  image: string
  productName: string
  price: string
  category: CategoriesID
  slug: string
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  productName,
  price,
  category,
  slug,
}) => {
  return (
    <Link href={`/products/${category.slug}/${slug}`}>
      <div className="group relative cursor-pointer">
        <div className="min-h-80 aspect-w-1 aspect-h-1 lg:aspect-none relative h-96 w-full overflow-hidden rounded-t bg-gray-200 group-hover:opacity-75 lg:h-80">
          <Image
            src={`${assetsAPI}/${image}?height=500&width=500`}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="space-y-2 px-4 py-6">
          <h3 className="text-sm text-gray-700">
            {productName}
            <span className="mb-0 ml-2 inline-block rounded-3xl bg-gray-200 px-2 py-1 text-sm text-gray-500">
              {category.category_name}
            </span>
          </h3>
          <p className="text-lg font-medium text-gray-900">${price}</p>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
