import { api } from "../graphql/hooks"

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
        }
    }
})

export const {
    useGetNamesByIdQuery,
    useGetNamesByNameQuery,
    useGetNamesByUserAndLabelQuery
} = graphqlApi