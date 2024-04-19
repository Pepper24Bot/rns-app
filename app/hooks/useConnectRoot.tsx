import "@therootnetwork/api-types"; // optional, for Typescript support
import { ApiPromise } from "@polkadot/api";
import { getApiOptions, getPublicProvider } from "@therootnetwork/api";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import useNetworkConfig from "./useNetworkConfig";

export interface ConnectProps {
  state: "initialize" | "reinitialize";
}

export default function useConnectRoot(props?: ConnectProps) {
  const { address } = useAccount();
  const { name } = useNetworkConfig();
  const { updateRootDetails } = useRootNetworkState();

  const setup = async () => {
    const api = await ApiPromise.create({
      ...getApiOptions(),
      ...getPublicProvider("root"),
    });

    const [fpHolder, chain, chainId, nodeName, nodeVersion] = await Promise.all(
      [
        api.query.futurepass.holders(address || ""),
        api.rpc.system.chain(),
        api.query.evmChainId.chainId(),
        api.rpc.system.name(),
        api.rpc.system.version(),
      ]
    );

    const fpAccount = fpHolder?.unwrapOr(undefined);

    if (fpAccount) {
      updateRootDetails({
        futurePassAddress: fpAccount?.toString(),
        eoaAddress: address,
        chain: chain?.toString(),
        chainId: chainId?.toString(),
        nodeName: nodeName?.toString(),
        nodeVersion: nodeVersion?.toString(),
      });
    }
  };

  // Initial load only
  useEffect(() => {
    if (address && props?.state === "initialize") {
      setup();
    }
  }, [address]);

  return { setup };
}
