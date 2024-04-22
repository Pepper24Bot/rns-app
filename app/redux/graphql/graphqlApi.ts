import { api } from "./hooks"

export const graphqlApi = api.enhanceEndpoints({
    addTagTypes: ["Name"],
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
        GetPrimaryNameResolver: {
            providesTags: ["Name"]
        }
    }
})

export const {
    useGetNamesByIdQuery,
    useGetNamesByNameQuery,
    useGetNamesByUserAndLabelQuery,
    useGetPrimaryNameResolverQuery
} = graphqlApi