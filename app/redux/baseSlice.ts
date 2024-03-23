
import { BASE_URL } from '@/services/api'
import { customBaseQuery } from '@/services/customQuery'
import { createApi } from '@reduxjs/toolkit/query/react'

export const api = createApi({
    reducerPath: 'RnsApi',
    baseQuery: customBaseQuery({
        baseUrl: BASE_URL,
    }),
    tagTypes: [], // TODO: Add tag types for api endpoints to revalidate data
    endpoints: () => { return {}; },
})