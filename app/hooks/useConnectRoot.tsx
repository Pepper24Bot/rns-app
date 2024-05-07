import "@therootnetwork/api-types"; // optional, for Typescript support
import { ApiPromise } from "@polkadot/api";
import {
  NetworkName,
  getApiOptions,
  getPublicProvider,
} from "@therootnetwork/api";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { parseCookie } from "@/utils/common";

import useNetworkConfig from "./useNetworkConfig";

export interface ConnectProps {
  state: "initialize" | "reinitialize";
}

export default function useConnectRoot(props?: ConnectProps) {
  const { network } = useNetworkConfig();
  const { address } = useAccount();
  const { updateRootDetails } = useRootNetworkState();

  const isFpActive = parseCookie("isFpActive") === "true";
  const [api, setApi] = useState<ApiPromise>();

  const getApiPromise = async () => {
    const api = await ApiPromise.create({
      ...getApiOptions(),
      ...getPublicProvider(network),
    });

    setApi(api);
    return api;
  };

  const setup = async () => {
    if (address) {
      const api = await getApiPromise();
      const fpHolder = await api.query.futurepass.holders(address);
      const fpAccount = fpHolder.unwrapOr(undefined)?.toString();

      updateRootDetails({
        futurePassAddress: fpAccount,
        eoaAddress: address,
        isFpActive: isFpActive,
      });
    }
  };

  // Initial load only
  useEffect(() => {
    if (address && props?.state === "initialize") {
      setup();
    }
  }, [address]);

  return { setup, api, getApiPromise };
}
