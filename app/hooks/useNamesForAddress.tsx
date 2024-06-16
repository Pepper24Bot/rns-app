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
  page?: number;
}

export default function useNamesForAddress(props: NamesProps) {
  const { skip = false, address, page = 1, ...rest } = props;
  const { filter, orderBy, orderDirection, pageSize = 50 } = rest;

  const { client } = useNetworkConfig();

  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(!skip);

  const [names, setNames] = useState<GetNamesForAddressReturnType>([]);

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

  // TODO: Memoize
  useEffect(() => {
    if (address && address !== "0x" && !skip) {
      getNames(address);
    }
  }, [
    skip,
    address,
    filter?.searchString,
    filter?.allowExpired,
    orderBy,
    orderDirection,
    pageSize,
    page,
  ]);

  return {
    names,
    isLoading,
    isError,
    isSuccess,
  };
}
