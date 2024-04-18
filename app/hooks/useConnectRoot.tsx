import "@therootnetwork/api-types"; // optional, for Typescript support
import { ApiPromise } from "@polkadot/api";
import { getApiOptions, getPublicProvider } from "@therootnetwork/api";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import useNetworkConfig from "./useNetworkConfig";

export default function useConnectRoot() {
  const { address } = useAccount();
  const { name } = useNetworkConfig();
  const { updateRootDetails } = useRootNetworkState();

  const setup = async (address: string = "") => {
    const api = await ApiPromise.create({
      ...getApiOptions(),
      ...getPublicProvider(name),
    });

    const [chain, chainId, nodeName, nodeVersion, fpHolder] = await Promise.all(
      [
        api.rpc.system.chain(),
        api.query.evmChainId.chainId(),
        api.rpc.system.name(),
        api.rpc.system.version(),
        api.query.futurepass.holders(address || ""),
      ]
    );

    const fpAccount = fpHolder.unwrapOr(undefined);

    updateRootDetails({
      futurePassAddress: fpAccount?.toString(),
      chain: chain?.toString(),
      chainId: chainId?.toString(),
      nodeName: nodeName?.toString(),
      nodeVersion: nodeVersion?.toString(),
    });
  };

  // Initial load only
  useEffect(() => {
    setup(address);
  }, [address]);

  return { setup };
}
