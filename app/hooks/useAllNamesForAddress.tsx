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
import { getSubPages } from "@/utils/common";
import { useDashboardState } from "@/redux/dashboard/dashboardSlice";

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
    filter = { name: "", address: "0x" },
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

  const { updateIdentities } = useDashboardState();

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
        orderBy:
          orderBy === OrderBy.LabelNameLength
            ? Domain_OrderBy.RegistrationRegistrationDate
            : (orderBy as Domain_OrderBy),
        orderDirection,
        sortByLength: orderBy === OrderBy.LabelNameLength,
      },
      { skip: skip || address === "0x" || isEnsFetching }
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
      updateIdentities({
        totalDomains,
        displayedNames: [...displayedPage],
      });
    }
  }, [domains, page, count, pageSize, orderBy, orderDirection]);

  // useEffect(() => {
  //   console.log(`
  //     isLoading:: ${isLoading}
  //     isFetching:: ${isFetching}
  //     isSuccess:: ${isSuccess}
  //     isError:: ${isError}
  //     domains:: ${domains?.length}
  //     displayedPage:: ${displayedPage?.length}
  //   `);
  // }, [isFetching, isLoading, isSuccess, isError, domains, displayedPage]);

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
    pageCount: count,

    isLoading,
    isFetching: isFetching && isEmpty(domains),
    isFetched: isSuccess,
    isError,
  };
}
