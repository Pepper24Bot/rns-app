import { useAccount } from "wagmi";
import { signExtrinsicPayload } from "@/utils/futurepass";
import useNetworkConfig from "../useNetworkConfig";
import useConnectRoot from "../useConnectRoot";

export default function useFpCreateAccount() {
  const { network } = useNetworkConfig();
  const { address: walletAddress } = useAccount();
  const { getApiPromise } = useConnectRoot();

  const createFpAccount = async () => {
    const api = await getApiPromise();
    console.log(`
    network:: ${network}
    walletAddress:: ${walletAddress}
    `);

    // Only allow this function when on porcini network
    if (network === "porcini" && walletAddress) {
      const extrinsic = api.tx.futurepass.create(walletAddress);

      const signedExtrinsic = await signExtrinsicPayload({
        api,
        address: walletAddress ?? "",
        extrinsic,
      });

      const result = await api.tx(signedExtrinsic).send();
      console.log("create-fp-hash:: ", result.toHex());
    }
  };

  return {
    createFpAccount,
  };
}
