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
  isFromUrlRouter?: boolean; // for testing purposes only
}

export default function useNamesForAddress(props: NamesProps) {
  const { skip = false, address, isFromUrlRouter, ...rest } = props;
  const { filter, orderBy, orderDirection } = rest;

  const { client } = useNetworkConfig();

  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [names, setNames] = useState<GetNamesForAddressReturnType>([]);

  const getNames = async (address: Address) => {
    console.log("props:: ", rest);
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
    if (address && address !== "0x" && !skip) {
      if (isFromUrlRouter) {
        console.log("------------------------------------");
        // console.log("getNames....");
      }

      getNames(address);
    }
  }, [
    address,
    skip,
    filter?.searchString,
    filter?.allowExpired,
    orderBy,
    orderDirection,
  ]);

  return {
    names,
    isLoading,
    isError,
    isSuccess,
  };
}
