import { useEffect, useState } from "react";
import {
  GetNamesForAddressParameters,
  GetNamesForAddressReturnType,
  getNamesForAddress,
} from "@ensdomains/ensjs/subgraph";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { Address } from "viem";

import useNetworkConfig from "./useNetworkConfig";

export interface NamesProps extends GetNamesForAddressParameters {
  skip?: boolean;
}

export default function useNamesForAddress(props: NamesProps) {
  const { filter, skip = false } = props;
  const { client } = useNetworkConfig();
  const { useRootNetwork } = useRootNetworkState();
  const {
    data: { address },
  } = useRootNetwork();

  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [names, setNames] = useState<GetNamesForAddressReturnType>([]);

  const getNames = async (address: Address) => {
    try {
      const data = await getNamesForAddress(client, {
        address: address,
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
