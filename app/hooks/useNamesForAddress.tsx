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
}

export default function useNamesForAddress(props: NamesProps) {
  const { skip = false, address, enableAggregated, ...rest } = props;
  const { filter, orderBy, orderDirection, pageSize, previousPage } = rest;

  const { client } = useNetworkConfig();

  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [names, setNames] = useState<GetNamesForAddressReturnType>([]);
  const [totalNames, setTotalNames] = useState<GetNamesForAddressReturnType>(
    []
  );
  const [totalCount, setTotalCount] = useState<number>(0);

  /**
   * TODO: Fix this
   * check how to get the total count of items in graphql
   * without the limit of 1000
   */
  const getTotalNames = async () => {
    const data = await getNamesForAddress(client, {
      address,
      pageSize: 1000,
      filter,
    });

    setTotalCount(data.length);
    setTotalNames(data);
  };

  const getNames = async (address: Address) => {
    try {
      const data = await getNamesForAddress(client, {
        address,
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

  useEffect(() => {
    if (enableAggregated && address && !skip) {
      getTotalNames();
    }
  }, [enableAggregated, address, filter?.searchString, filter?.allowExpired]);

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
    previousPage,
  ]);

  return {
    names,
    totalNames: totalCount,
    isLoading,
    isError,
    isSuccess,
  };
}
