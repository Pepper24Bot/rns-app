import { api } from "./hooks"

/**
 * @deprecated Do not use this hooks anymore
 * 
 * Use ensjs getNamesForAddress and getWrappedDate
 * using the following new hooks
 * - useNamesForAddress
 * - useWrappedData
 */
export const graphqlApi = api.enhanceEndpoints({
    addTagTypes: ["Name", "Primary"],
    endpoints: {
        GetNamesById: {
            providesTags: ["Name"]
        },
        GetNamesByName: {
            providesTags: ["Name"]
        },
        GetNamesByUserAndLabel: {
            providesTags: ["Name"]
        },
        GetNamesByIdAndName: {
            providesTags: ["Name"]
        },
        GetPrimaryNameResolver: {
            providesTags: ["Name"]
        }
    }
})

export const {
    /** @deprecated new hook: useNamesForAddress */
    useGetNamesByIdQuery,
    /** @deprecated new hook: useNamesForAddress */
    useGetNamesByNameQuery,
    /** @deprecated new hook: useNamesForAddress */
    useGetNamesByUserAndLabelQuery,
    /** @deprecated new hook: useNamesForAddress */
    useGetPrimaryNameResolverQuery,
    /** @deprecated new hook: useNamesForAddress */
    useGetNamesByIdAndNameQuery
} = graphqlApi