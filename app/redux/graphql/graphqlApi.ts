import { makeNameObject } from "@ensdomains/ensjs/subgraph"
import { NamesByAddressQuery, NamesByAddressQueryVariables, api } from "./hooks"
import { argsToArgsConfig } from "graphql/type/definition"
import { isEmpty } from "lodash"

/**
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
        },
        NamesByAddress: {
            transformResponse: (response: NamesByAddressQuery, meta, arg) => {
                const { ensName } = arg as NamesByAddressQueryVariables

                const domains = response.domains

                const newList = domains.map((domain) => {
                    return {
                        ...makeNameObject(domain as any),
                        labelLength: domain.labelName?.length,
                        cost: domain.registration?.cost,
                        records: { ...domain.resolver },
                        createdAt: domain.createdAt,
                        expiryDate: domain.registration?.expiryDate,
                        registrationDate: domain.registration?.registrationDate
                    }
                })
                response.domains = newList as any

                const primary = newList?.filter((domain) => {
                    return domain.name === ensName
                })

                if (primary && !isEmpty(primary)) {
                    const shifted = newList?.filter((domain) => {
                        return domain.name !== ensName;
                    });

                    shifted.unshift(primary[0]);

                    response.domains = shifted as any
                }

                return response
            },
            providesTags: ["Name"],
        }
    }
})

export const {
    useGetNamesByIdQuery,
    useGetNamesByNameQuery,
    useGetNamesByUserAndLabelQuery,
    useGetPrimaryNameResolverQuery,
    useGetNamesByIdAndNameQuery,
    useNamesByAddressQuery
} = graphqlApi