import { Name, makeNameObject } from "@ensdomains/ensjs/subgraph"
import { NamesByAddressQuery, NamesByAddressQueryVariables, OrderDirection, api } from "./hooks"
import { isEmpty } from "lodash"
import { orderByLength } from "@/utils/common"

export interface NamesByAddressResponse extends NamesByAddressQuery {
    totalDomains: number,
    subPages: DomainResponse[][]
    displayedPage: DomainResponse[]
}

export interface DomainResponse extends Omit<Name, "createdAt" | "expiryDate" | "registrationDate"> {
    labelLength?: number,
    cost?: string,
    records?: { text?: string[], coinTypes: string[] }
    createdAt?: string,
    expiryDate?: string,
    gracePeriod?: string,
    registrationDate?: string
}

export interface NameResponse {
    id: string,
    labelName: string,
    expiryDate: string,
    wrappedOwner: {
        id: string
    }
}

/**
 * Use ensjs getNamesForAddress and getWrappedDate
 * using the following new hooks
 * - useNamesForAddress
 * - useWrappedData
 */
export const graphqlApi = api.enhanceEndpoints({
    addTagTypes: ["Name", "Primary"],
    endpoints: {
        Names: {
            providesTags: ["Name"],
        },
        NamesByAddress: {
            transformResponse: (response: NamesByAddressResponse, meta, arg) => {
                const { ensName, sortByLength, orderDirection } = arg as NamesByAddressQueryVariables
                const domains = response.domains

                const newList = domains.map((domain) => {
                    return {
                        ...makeNameObject(domain as any),
                        labelLength: domain.labelName?.length,
                        cost: domain.registration?.cost,
                        records: { ...domain.resolver },
                        createdAt: domain.createdAt,
                        expiryDate: domain.registration?.expiryDate,
                        gracePeriod: domain.wrappedDomain?.expiryDate,
                        registrationDate: domain.registration?.registrationDate
                    }
                })
                response.domains = newList as any

                const primary = newList?.filter((domain) => {
                    return domain.name === ensName
                })

                if (sortByLength) {
                    response.domains = orderByLength(newList as DomainResponse[], orderDirection || OrderDirection.Desc) as any
                }

                if (primary && !isEmpty(primary)) {
                    const shifted = newList?.filter((domain) => {
                        return domain.name !== ensName;
                    });

                    shifted.unshift(primary[0]);
                    response.domains = shifted as any
                }

                const totalDomains = response.domains?.length

                return {
                    ...response,
                    totalDomains
                }
            },
            providesTags: ["Name"],
        }
    }
})

export const {
    useNamesByAddressQuery,
    useNamesQuery
} = graphqlApi