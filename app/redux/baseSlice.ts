
import { BASE_URL } from '../services/api'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
    reducerPath: 'RnsApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: [], // TODO: Add tag types for api endpoints to revalidate data
    endpoints: () => ({})
})
