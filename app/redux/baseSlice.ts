
import { BASE_URL } from '@/services/url'
import { customBaseQuery } from '@/services/customQuery'
import { createApi } from '@reduxjs/toolkit/query/react'

export const api = createApi({
    reducerPath: 'RnsApi',
    baseQuery: customBaseQuery({
        baseUrl: BASE_URL,
    }),
    tagTypes: ['Name'],
    endpoints: () => { return {}; },
})