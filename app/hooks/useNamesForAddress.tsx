import { useEffect, useState } from "react";
import {
  GetNamesForAddressParameters,
  GetNamesForAddressReturnType,
  getNamesForAddress,
} from "@ensdomains/ensjs/subgraph";
import { Address } from "viem";

import useNetworkConfig from "./useNetworkConfig";

export interface NamesProps extends GetNamesForAddressParameters {
  skip?: boolean;
  enableAggregated?: boolean;
  page?: number;
}

export default function useNamesForAddress(props: NamesProps) {
  const { skip = false, address, enableAggregated, page = 1, ...rest } = props;
  const { filter, orderBy, orderDirection, pageSize = 50 } = rest;

  const { client } = useNetworkConfig();

  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isFetched, setIsFetched] = useState<boolean>(true);

  const [names, setNames] = useState<GetNamesForAddressReturnType>([]);
  const [totalNames, setTotalNames] = useState<GetNamesForAddressReturnType>(
    []
  );
  const [pageCount, setPageCount] = useState(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [previousPage, setPreviousPage] = useState<
    GetNamesForAddressReturnType[]
  >([]);

  /**
   * Get previous page based on page size
   * Restructure the totalNames
   */
  const getPreviousPage = (
    data: GetNamesForAddressReturnType,
    pageCount: number
  ) => {
    const pages = Array.from({ length: pageCount }).map((_, index) => {
      return data.slice(index * pageSize, index * pageSize + pageSize);
    });
    setPreviousPage(pages);
  };

  /**
   * TODO: Fix this
   * check how to get the total count of items in graphql
   * without the limit of 1000
   *
   * inifinitequery
   */
  const getTotalNames = async () => {
    try {
      const data = await getNamesForAddress(client, {
        address,
        pageSize: 1000,
        filter,
        orderBy,
        orderDirection,
      });
      const totalCount = data.length;
      const count = Math.ceil(totalCount / pageSize);

      setTotalCount(totalCount);
      setTotalNames(data);
      setPageCount(count);
      setIsFetched(true);
    } catch (error) {
      setIsFetched(false);
    }
  };

  const getNames = async (address: Address) => {
    try {
      const data = await getNamesForAddress(client, {
        address,
        previousPage: previousPage[page - 2],
        ...rest,
      });

      setNames([...data]);
      setIsSuccess(true);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      // TODO: Add error snackbar
    }
  };

  // TODO: Memoize
  useEffect(() => {
    if (enableAggregated && address && !skip) {
      getTotalNames();
    }
  }, [
    enableAggregated,
    address,
    filter?.searchString,
    filter?.allowExpired,
    orderBy,
    orderDirection,
  ]);

  // TODO: Memoize
  useEffect(() => {
    if (isFetched && totalCount) {
      const count = Math.ceil(totalCount / pageSize);
      setPageCount(count);
      getPreviousPage(totalNames, count);
    }
  }, [totalNames, pageSize]);

  // TODO: Memoize
  useEffect(() => {
    if (address && address !== "0x" && !skip) {
      getNames(address);
    }
  }, [
    address,
    skip,
    filter?.searchString,
    filter?.allowExpired,
    orderBy,
    orderDirection,
    pageSize,
    page,
  ]);

  return {
    /**
     * This will return names
     * based on the provided pageSize, filters and sorting options
     *
     * e.g pagesize = 3
     * this will only contain 3 names
     */
    names,

    /**
     * This will only have value when the
     * enableAggregate prop is set to true
     */
    totalCount,

    /**
     * This will only have value when the
     * enableAggregate prop is set to true and will
     * always return all names disregarding the
     * page size provided
     */
    totalNames,

    /**
     * By default, the pageCount is 1.
     * This will only be updated when the prop
     * enableAggregate is set to true
     */
    pageCount,

    isLoading,
    isError,
    isSuccess,
  };
}
