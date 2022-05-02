import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { QueryClient, useMutation, useQuery } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { Product } from '../../../interfaces/product.interface'
import { Session, TempOrder } from '../../../interfaces/session.interface'
import { getSingleProduct } from '../../../services/products.service'
import {
  createSession,
  getSession,
  updateSession,
} from '../../../services/sessions.service'

const assetsAPI = process.env.NEXT_PUBLIC_ASSETS_ENDPOINT

interface SingleProductProps {
  product: Product | null
}

const SingleProduct: NextPage<SingleProductProps> = ({ product }) => {
  const [colorValue, setColorValue] = useState<string | null>(null)
  const [sizeShortTitle, setSizeShortTitle] = useState<string | null>(null)
  const [isSession, setSession] = useState(
    typeof window !== 'undefined' && localStorage.getItem('session_id') !== null
  )

  const { data: session, refetch } = useQuery('session', getSession, {
    enabled: isSession,
  })

  const mutation = useMutation((newSession: Session): any => {
    if (!isSession) {
      createSession({ data: newSession }).then(({ create_session_item }) => {
        localStorage.setItem('session_id', create_session_item.id)
      })

      setSession(true)
    } else {
      updateSession({
        data: newSession,
        id: localStorage.getItem('session_id'),
      }).then(() => {
        refetch()
      })
    }
  })

  const addToCart = async () => {
    const cartItems = session?.temp_order || []
    const temp_order = [
      ...cartItems,
      {
        id: uuidv4(),
        product_id: product?.id,
        product_name: product?.product_name,
        price: product?.price,
        quantity: '1',
        color_value: colorValue,
        size_short_title: sizeShortTitle,
      },
    ]

    mutation.mutate({
      status: 'draft',
      temp_order,
    })
  }

  return (
    <div className="mx-auto max-w-4xl py-6 px-4 md:py-12 md:px-6 lg:max-w-7xl lg:px-8">
      <Head>
        <title>{product?.product_name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col space-y-3 sm:flex-row sm:space-x-4">
        <div className="relative h-96 w-full sm:w-80">
          <Image
            src={`${assetsAPI}/${product?.product_image.id}`}
            layout="fill"
            objectFit="cover"
          />
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="flex items-center justify-between text-2xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {product?.product_name}
              <div>
                {product?.product_categories.map(
                  ({ categories_id: { category_name, id } }) => (
                    <span
                      className="mb-0 ml-2 inline-block cursor-pointer rounded-3xl bg-gray-200 px-2 py-1 text-xs font-medium tracking-normal text-gray-500"
                      key={id}
                    >
                      {category_name}
                    </span>
                  )
                )}
              </div>
            </h2>
            <p className="text-xl font-medium text-gray-900 sm:text-2xl">
              ${product?.price}
            </p>
          </div>

          <div className="space-y-6">
            {product?.show_colors && (
              <div className="space-y-2">
                <h3 className="text-md font-semibold">Choose a color</h3>
                <div className="flex space-x-2">
                  {product?.available_colors.map(
                    ({ product_colors_id: { id, color_value } }) => (
                      <label
                        className="inline-flex cursor-pointer items-center"
                        key={id}
                      >
                        <input
                          type="radio"
                          value={color_value}
                          name="colors"
                          className="peer absolute h-0 w-0 opacity-0"
                          onChange={(e) => setColorValue(e.target.value)}
                        />
                        <span
                          className="h-8 w-8 rounded-2xl border-2 border-white peer-checked:shadow-[0_0_0_2px_rgba(204,204,204)]"
                          style={{ background: color_value }}
                        />
                      </label>
                    )
                  )}
                </div>
              </div>
            )}

            {product?.show_sizes && (
              <div className="space-y-2">
                <h3 className="text-md font-semibold">Choose a size</h3>
                <div className="flex">
                  {product?.available_sizes.map(
                    ({ product_sizes_id: { id, short_title } }) => (
                      <label
                        className="inline-flex cursor-pointer items-center"
                        key={id}
                      >
                        <input
                          type="radio"
                          value={short_title}
                          className="peer absolute h-0 w-0 opacity-0"
                          name="sizes"
                          onChange={(e) => setSizeShortTitle(e.target.value)}
                        />
                        <span className="mr-2 flex h-8 w-8 items-center justify-center rounded border-2 border-gray-300 peer-checked:border-black peer-checked:bg-black peer-checked:text-white">
                          {short_title}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            className="rounded bg-green-600 px-8 py-2 text-white disabled:bg-gray-600"
            onClick={addToCart}
          >
            Add to cart
          </button>
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query
  const data = async () => await getSingleProduct({ productSlug: slug })

  const queryClient = new QueryClient()
  await queryClient.prefetchQuery<Product>('product', data)

  const product = queryClient.getQueryData('product')

  if (!product) return { notFound: true }

  return {
    props: {
      product,
    },
  }
}

export default SingleProduct
