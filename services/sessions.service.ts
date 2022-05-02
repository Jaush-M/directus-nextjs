import { request, gql } from 'graphql-request'

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT
const tokenAPI = process.env.NEXT_PUBLIC_DIRECTUS_TOKEN

const requestHandler = async (query: string, variables: any = {}) => {
  if (!graphqlAPI || !tokenAPI) return

  const req = await request({
    url: graphqlAPI,
    document: query,
    variables: variables,
    requestHeaders: {
      Authorization: `Bearer ${tokenAPI}`,
    },
  })

  return req
}

export const getSession = async () => {
  const query = gql`
    query ($id: ID!) {
      session_by_id(id: $id) {
        id
        temp_order
      }
    }
  `

  const { session_by_id } = await requestHandler(query, {
    id: localStorage.getItem('session_id'),
  })
  return session_by_id
}

export const createSession = async (variables?: any) => {
  const query = gql`
    mutation ($data: create_session_input!) {
      create_session_item(data: $data) {
        id
      }
    }
  `

  return await requestHandler(query, variables)
}

export const updateSession = async (variables?: any) => {
  const query = gql`
    mutation ($data: update_session_input!, $id: ID!) {
      update_session_item(data: $data, id: $id) {
        id
      }
    }
  `
  await requestHandler(query, variables)
}
