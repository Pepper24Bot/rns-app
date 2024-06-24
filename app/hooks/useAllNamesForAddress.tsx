import { useEffect, useState } from "react";
import { useEnsName } from "wagmi";
import {
  DomainResponse,
  NamesByAddressResponse,
  useNamesByAddressQuery,
} from "@/redux/graphql/graphqlApi";
import { Address } from "viem";
import { Domain_OrderBy, OrderDirection } from "@/redux/graphql/hooks";
import { isEmpty } from "lodash";
import { OrderBy } from "@/constants/components";
import { getFilterExpiry, getSubPages } from "@/utils/common";
import { useDashboardState } from "@/redux/dashboard/dashboardSlice";
import { View } from "@/interfaces/global/types";

export interface NamesProps {
  skip?: boolean;
  dashboard?: boolean;
  pagination?: {
    /** Currently displayed page */
    page?: number;

    /** Number of items displayed per page */
    pageSize?: number;
  };
  filter?: {
    address: Address;
    name?: string;
    views?: View[];

    /** get names that are expired */
    expiryDate_lt?: string;

    /** get names that are active */
    expiryDate_gte?: string;
  };
  sorting?: {
    orderBy?: OrderBy;
    orderDirection?: OrderDirection;
  };
}

export default function useAllNamesForAddress(props: NamesProps) {
  const {
    dashboard = false,
    skip = false,
    filter = {
      name: "",
      address: "0x",
    },
    pagination = { page: 1, pageSize: 1000 },
    sorting = {
      orderBy: Domain_OrderBy.RegistrationRegistrationDate,
      orderDirection: OrderDirection.Desc,
    },
  } = props;

  const { name, address } = filter;
  const { page = 1, pageSize = 1000 } = pagination;
  const { orderBy, orderDirection } = sorting;

  const [displayedPage, setDisplayedPage] = useState<
    DomainResponse[] | undefined
  >(undefined);

  const [displayedPageCount, setDisplayedPageCount] = useState<number>(0);

  const { updateIdentities, useFilters } = useDashboardState();
  const options = useFilters();
  const filterExpiry = getFilterExpiry(options?.filter?.views);

  const { data: ensName, isFetching: isEnsFetching } = useEnsName({
    address,
    query: {
      enabled: address !== "0x",
    },
  });

  /**
   * if the date passed < the expiry date, then the name is active   *
   * if the date passed > the expiry date, then the name is expired
  
   * #1. how to get the expired names today
   * expiryDate_lt: "1718928000" // e.g today
   * expiryDate_gte: "0" // bottom most date
   *
   * #2. how to get active names today
   * expiryDate_gte: "1718928000" // e.g today
   * expiryDate_lt: "9007199254740991" // Number.MAX_SAFE_INTEGER
   *
   * #3. how to get both active and expired
   * expiryDate_gte: "0" // bottom most date
   * expiryDate_lt: "9007199254740991" // Number.MAX_SAFE_INTEGER
   *
   * expiryDate_gte and expiryDate_lt should always be a combination
   * avoid using OR in condition to avoid performance issue
   * see: https://thegraph.com/docs/en/querying/graphql-api/
   */
  const { data, isSuccess, isLoading, isFetching, isError } =
    useNamesByAddressQuery(
      {
        id: address.toLowerCase(),
        ensName,
        name,
        expiryDate_gte: filterExpiry.expiryDate_gte,
        expiryDate_lt: filterExpiry.expiryDate_lt,
        orderBy:
          orderBy === OrderBy.LabelNameLength
            ? Domain_OrderBy.RegistrationRegistrationDate // default
            : (orderBy as Domain_OrderBy),
        orderDirection,
        sortByLength: orderBy === OrderBy.LabelNameLength,
      },
      {
        skip: skip || address === "0x" || isEnsFetching,
      }
    );

  const response = data as NamesByAddressResponse;
  const domains = response?.domains as unknown as DomainResponse[];
  const totalDomains = response?.totalDomains || 0;
  const count = Math.ceil(totalDomains / pageSize) || 1;

  useEffect(() => {
    if (domains && dashboard) {
      const subPages = getSubPages({
        data: domains as any[],
        pageCount: count,
        pageSize: pageSize,
      });

      const displayedPage = subPages[page - 1] || undefined;

      setDisplayedPage([...displayedPage]);
      setDisplayedPageCount(count);
      updateIdentities({
        totalDomains,
        totalPageCount: count,
        displayedNames: [...displayedPage],
      });
    }
  }, [domains, page, count, pageSize, orderBy, orderDirection]);

  return {
    /**
     * This will return names
     * based on the provided pageSize, filters and sorting options
     *
     * e.g pagesize = 3
     * this will only contain 3 names
     */
    displayedNames: displayedPage,

    names: domains as unknown as DomainResponse[],

    /** Total count of names for the given address disregarding pagination */
    totalNames: totalDomains,

    /** The total number of pages */
    totalPageCount: displayedPageCount,

    pageCount: count,

    isLoading,
    isFetching: isFetching && isEmpty(domains),
    isFetched: isSuccess,
    isError,
  };
}
