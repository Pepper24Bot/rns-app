import React, { useEffect, useState } from "react";
import {
  GetNamesForAddressParameters,
  GetNamesForAddressReturnType,
  getNamesForAddress,
} from "@ensdomains/ensjs/subgraph";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";

import useNetworkConfig from "./useNetworkConfig";

export default function useNamesForAddress(
  props: GetNamesForAddressParameters
) {
  const {} = props;
  const { client } = useNetworkConfig();
  const { useRootNetwork } = useRootNetworkState();
  const {
    data: { address },
  } = useRootNetwork();

  const [names, setNames] = useState<GetNamesForAddressReturnType>([]);

  const fetchData = async () => {
    if (address && address !== "0x") {
      const data = await getNamesForAddress(client, {
        address: address,
      });
      setNames([...data]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [address]);

  return {
    names,
  };
}
