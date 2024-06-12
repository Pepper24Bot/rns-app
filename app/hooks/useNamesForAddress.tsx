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
  const { filter, skip = false, address, isFromUrlRouter } = props;
  const { client } = useNetworkConfig();

  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [names, setNames] = useState<GetNamesForAddressReturnType>([]);

  const getNames = async (address: Address) => {
    try {
      const data = await getNamesForAddress(client, {
        address,
        filter,
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
        console.log("getNames....");
      }

      getNames(address);
    }
  }, [address, skip]);

  return {
    names,
    isLoading,
    isError,
    isSuccess,
  };
}
