import { Name, makeNameObject } from "@ensdomains/ensjs/subgraph"
import { NamesByAddressQuery, NamesByAddressQueryVariables, api } from "./hooks"
import { isEmpty } from "lodash"

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
    expiryDate?: string
    registrationDate?: string
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
        TotalDomains: {
            transformResponse: (response: NamesByAddressResponse, meta, arg) => {
                return { ...response, totalDomains: response.domains?.length }
            },
            providesTags: ["Name"],
        },
        NamesByAddress: {
            transformResponse: (response: NamesByAddressResponse, meta, arg) => {
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
    useTotalDomainsQuery
} = graphqlApi