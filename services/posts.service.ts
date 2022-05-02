import { request, gql } from 'graphql-request'

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT

/**
 * It makes a GraphQL request to the GraphQL API, and returns the posts
 * @returns An array of post objects.
 */
export const getPosts = async () => {
  if (!graphqlAPI) return

  const query = gql`
    query {
      posts {
        id
        title
        featured_image {
          id
        }
        body
      }
    }
  `

  const { posts } = await request(graphqlAPI, query)
  return posts
}
