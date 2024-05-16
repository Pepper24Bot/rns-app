import { porcini, porciniWalletConfig } from "@/chains/porcini";
import { root, rootWalletConfig } from "@/chains/root";
import { NetworkName } from "@therootnetwork/api";

export const getNetworkConfig = (chainId: string) => {
  switch (chainId) {
    // Testnet - Porcini
    case "7672":
      return {
        network: "porcini" as NetworkName,
        name: "porcini",
        config: porcini,
        walletConfig: porciniWalletConfig,
      };
    // Mainnet
    case "7668":
    default:
      return {
        network: "root" as NetworkName,
        name: "mainnet",
        config: root,
        walletConfig: rootWalletConfig,
      };
  }
};

export default function useNetworkConfig() {
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;

  return getNetworkConfig(chainId || root.id.toString());
}
