import { api } from "./hooks"

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
        GetPrimaryNameResolver: {
            providesTags: ["Primary"]
        }
    }
})

export const {
    useGetNamesByIdQuery,
    useGetNamesByNameQuery,
    useGetNamesByUserAndLabelQuery,
    useGetPrimaryNameResolverQuery
} = graphqlApi