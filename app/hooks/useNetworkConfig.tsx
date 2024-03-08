import { porcini, porciniWalletConfig } from "@/chains/porcini";
import { root, rootWalletConfig } from "@/chains/root";

export const getNetworkConfig = (chainId: string) => {
  switch (chainId) {
    // Testnet - Porcini
    case "7672":
      return {
        config: porcini,
        walletConfig: porciniWalletConfig,
      };
    // Mainnet
    case "7668":
    default:
      return {
        config: root,
        walletConfig: rootWalletConfig,
      };
  }
};

export default function useNetworkConfig() {
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;

  return getNetworkConfig(chainId || root.id.toString());
}
