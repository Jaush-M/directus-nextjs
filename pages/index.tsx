import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { useEffect } from 'react'
import { dehydrate, QueryClient, useQuery } from 'react-query'
import { useRecoilValue } from 'recoil'
import { filterState } from '../atoms/modalAtom'
import CategoryFilter from '../components/categoryFilter'
import ProductCard from '../components/productCard'
import { Category } from '../interfaces/category.interface'
import { Product } from '../interfaces/product.interface'
import {
  getCategories,
  getFilteredProducts,
  getProducts,
} from '../services/products.service'

interface HomeProps {}

const Home: NextPage<HomeProps> = () => {
  const selectedCategories = useRecoilValue(filterState)
  const {
    data: products,
    isSuccess: isProducts,
    isLoading,
  } = useQuery<Product[]>(['products', selectedCategories], getFilteredProducts)

  useEffect(() => {
    // console.log(isLoading)
    // console.log(selectedCategories)
  }, [selectedCategories])

  return (
    <div>
      <Head>
        <title>Ecommerce Site</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Latest products
        </h2>

        <CategoryFilter />
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {isProducts &&
            products?.map(
              ({
                id,
                product_name,
                product_image,
                price,
                product_categories,
                slug,
              }) => (
                <ProductCard
                  key={id}
                  productName={product_name}
                  image={product_image.id}
                  category={product_categories[0]?.categories_id}
                  price={price}
                  slug={slug}
                />
              )
            )}
        </div>
      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery<Product[]>(['products', []], getProducts)
  await queryClient.prefetchQuery<Category[]>('categories', getCategories)

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default Home
