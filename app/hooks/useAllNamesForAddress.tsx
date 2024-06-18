import { useEffect } from "react";
import { useEnsName } from "wagmi";
import {
  DomainResponse,
  NamesByAddressResponse,
  useNamesByAddressQuery,
} from "@/redux/graphql/graphqlApi";
import { Address } from "viem";
import {
  Domain_OrderBy,
  OrderDirection,
  useTotalDomainsQuery,
} from "@/redux/graphql/hooks";
import { isEmpty } from "lodash";

export interface NamesProps {
  skip?: boolean;
  isTesting?: boolean;
  pagination?: {
    /** Currently displayed page */
    page?: number;

    /** Number of items displayed per page */
    pageSize?: number;
  };
  filter?: {
    address: Address;
    name?: string;
  };
  sorting?: {
    orderBy?: Domain_OrderBy;
    orderDirection?: OrderDirection;
  };
}

export default function useAllNamesForAddress(props: NamesProps) {
  const {
    skip = false,
    filter = { name: "", address: "0x" },
    pagination = { page: 1, pageSize: 1000 },
    sorting = {
      orderBy: Domain_OrderBy["RegistrationRegistrationDate"],
      orderDirection: OrderDirection["Desc"],
    },
  } = props;

  const { name, address } = filter;
  const { page = 1, pageSize = 1000 } = pagination;
  const { orderBy, orderDirection } = sorting;

  const { data: ensName, isFetching: isEnsFetching } = useEnsName({
    address,
    query: {
      enabled: address !== "0x",
    },
  });

  const { data, isSuccess, isLoading, isFetching, isError } =
    useNamesByAddressQuery(
      {
        id: address.toLowerCase(),
        name,
        ensName,
        pageSize,
        skip: (page - 1) * pageSize,
        orderBy,
        orderDirection,
      },
      { skip: skip || address === "0x" || isEnsFetching }
    );

  const { data: aggregated } = useTotalDomainsQuery(
    {
      id: address.toLowerCase(),
      name,
    },
    { skip: skip || address === "0x" }
  );

  const domains = (data as NamesByAddressResponse)?.domains;
  const totalDomains =
    (aggregated as NamesByAddressResponse)?.totalDomains || 0;

  useEffect(() => {}, [isFetching, isLoading, isSuccess, isError, domains]);

  const count = Math.ceil(totalDomains / pageSize);

  return {
    /**
     * This will return names
     * based on the provided pageSize, filters and sorting options
     *
     * e.g pagesize = 3
     * this will only contain 3 names
     */
    names: domains as unknown as DomainResponse[],

    /** Total count of names for the given address disregarding pagination */
    totalNames: totalDomains,

    /** The total number of pages */
    pageCount: count,

    isLoading,
    isFetching: isFetching && isEmpty(domains),
    isFetched: isSuccess,
    isError,
  };
}
