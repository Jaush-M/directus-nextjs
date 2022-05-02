import { request, gql } from 'graphql-request'

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT

export const getCategories = async () => {
  if (!graphqlAPI) return

  const query = gql`
    {
      categories {
        id
        category_name
      }
    }
  `

  const { categories } = await request(graphqlAPI, query)
  return categories
}

export const getProducts = async () => {
  if (!graphqlAPI) return

  const query = gql`
    {
      products {
        id
        product_name
        product_image {
          id
        }
        product_categories {
          categories_id {
            id
            category_name
            slug
          }
        }
        price
        slug
      }
    }
  `

  const { products } = await request(graphqlAPI, query)
  return products
}

export const getFilteredProducts = async ({ queryKey }: any) => {
  if (!graphqlAPI) return

  const categories = queryKey[1]
  if (categories.length <= 0) {
    return getProducts()
  }

  const query = gql`
    {
      products(filter: { product_categories: { categories_id: { id: {_in: [${categories}]} } } }) {
        id
        product_name
        product_image {
          id
        }
        product_categories {
          categories_id {
            id
            category_name
            slug
          }
        }
        price
        slug
      }
    }
  `

  const { products } = await request(graphqlAPI, query)
  return products
}

export const getSingleProduct = async ({
  productSlug,
}: {
  productSlug: string | string[] | undefined
}) => {
  if (!graphqlAPI) return
  if (!productSlug) return

  const query = gql`
    {
      products(filter: { slug: { _eq: "${productSlug}"} }) {
        id
        product_name
        product_image {
          id
        }
        product_categories {
          categories_id {
            id
            category_name
            slug
          }
        }
        show_sizes
        show_colors
        available_colors{ 
          product_colors_id {
            id
            color_name
            color_value
          }
        }
        available_sizes {
          product_sizes_id {
            long_title
            short_title
            id
          }
        }
        price
        slug
      }
    }
  `

  const { products } = await request(graphqlAPI, query)

  return products[0]!
}
