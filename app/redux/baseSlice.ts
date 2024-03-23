
import { BASE_URL, GRAPHQL_URL } from '@/services/api'
import { customBaseQuery } from '@/services/customQuery'
import { createApi } from '@reduxjs/toolkit/query/react'
import { GraphQLClient } from 'graphql-request'

export const client = new GraphQLClient(GRAPHQL_URL)

export const api = createApi({
    reducerPath: 'RnsApi',
    baseQuery: customBaseQuery({
        baseUrl: BASE_URL,
    }),
    tagTypes: [], // TODO: Add tag types for api endpoints to revalidate data
    endpoints: () => { return {}; },
})