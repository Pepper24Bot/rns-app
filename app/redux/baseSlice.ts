
import { GRAPHQL_URL } from '@/services/api'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'
import { GraphQLClient } from 'graphql-request'

export const client = new GraphQLClient(GRAPHQL_URL)

export const api = createApi({
    reducerPath: 'RnsApi',
    // baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    baseQuery: graphqlRequestBaseQuery({
        client
    }),

    tagTypes: [], // TODO: Add tag types for api endpoints to revalidate data
    endpoints: () => ({})
})
