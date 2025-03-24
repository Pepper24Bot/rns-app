import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { signExtrinsicPayload } from "@/utils/futurepass";
import { ApiPromise } from "@polkadot/api";
import "@therootnetwork/api-types"; // optional, for Typescript support
import { useEffect, useState } from "react";
import { encodeFunctionData, erc20Abi } from "viem";
import { useAccount } from "wagmi";

import useConnectRoot from "../../useConnectRoot";
import useContractDetails from "../../useContractDetails";
import useEstimateFees from "../../useEstimateFees";
import { TokenProps } from "../useProxyToken";

export interface ConnectProps {
  state: "initialize" | "reinitialize";
}

export default function useExtrinsicTokenApproval() {
  const controller = useContractDetails({ action: "RegistrarController" });

  const { address: walletAddress } = useAccount();
  const { getEstimatedGas, getMaxFeePerGas } = useEstimateFees();
  const { getApiPromise } = useConnectRoot();
  const { useRootNetwork } = useRootNetworkState();
  const {
    data: { futurePassAddress: futurePass },
  } = useRootNetwork();

  const [apiPromise, setApiPromise] = useState<ApiPromise>();

  const approveTokenExtrinsic = async (props: TokenProps) => {
    const { spender, tokenAddr, amount } = props;

    if (spender && futurePass && apiPromise) {
      console.log("tokenAddr:: ", tokenAddr);
      // Get transaction data using encodeFunctionData
      const data = encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [spender, amount],
      });

      // Get Fee History
      const maxFeePerGas = await getMaxFeePerGas();

      // Prepare Transaction Call
      const evmCall = apiPromise.tx.evm.call(
        futurePass,
        controller.address,
        data,
        0,
        0, // gasLimit,
        maxFeePerGas,
        0,
        null,
        []
      );

      // Call ProxyExtrinsic
      const extrinsic = apiPromise.tx.futurepass.proxyExtrinsic(
        futurePass ?? "",
        evmCall
      );

      // Create Extrinsic Payload and Sign it using the wallet/eoa address
      const signedExtrinsic = await signExtrinsicPayload({
        api: apiPromise,
        address: walletAddress ?? "",
        extrinsic,
      });

      // Submit the transaction
      const result = await apiPromise.tx(signedExtrinsic).send();
      console.log("approve-extrinsic-tx:: ", result.toHex());
      return result.toHex();
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const api = await getApiPromise();
      setApiPromise(api);
    };

    initialize();
  }, []);

  return {
    approveTokenExtrinsic,
  };
}
