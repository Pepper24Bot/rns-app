import "@therootnetwork/api-types"; // optional, for Typescript support
import { useAccount } from "wagmi";
import { Address, encodeFunctionData, erc20Abi } from "viem";
import { signExtrinsicPayload } from "@/utils/futurepass";
import { useEffect, useState } from "react";
import { ApiPromise } from "@polkadot/api";

import useConnectRoot from "../useConnectRoot";
import useEstimateFees from "../useEstimateFees";

export interface TokenProps {
  fpAccount?: Address;
  spender: Address;
  tokenAddr: Address;
  amount: bigint;
}

export default function useFpToken() {
  const { getApiPromise } = useConnectRoot();
  const { address: walletAddress } = useAccount();
  const { getEstimatedGas, getMaxFeePerGas } = useEstimateFees();

  const [api, setApiPromise] = useState<ApiPromise>();

  const approveFp = async (props: TokenProps) => {
    const { fpAccount, spender, tokenAddr, amount } = props;

    if (fpAccount && api) {
      // Get transaction data using encodeFunctionData
      const data = encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [spender, amount],
      });

      // Estimate Contract Gas
      const gasLimit = await getEstimatedGas({
        account: walletAddress as Address,
        contractAddr: tokenAddr,
        data,
      });

      // Get Fee History
      const maxFeePerGas = await getMaxFeePerGas();

      // Prepare Transaction Call
      const evmCall = api.tx.evm.call(
        fpAccount,
        tokenAddr,
        data,
        0,
        gasLimit,
        maxFeePerGas,
        0,
        null,
        []
      );

      // Call ProxyExtrinsic
      const extrinsic = api.tx.futurepass.proxyExtrinsic(
        fpAccount ?? "",
        evmCall
      );

      // Create Extrinsic Payload and Sign it using the wallet/eoa address
      const signedExtrinsic = await signExtrinsicPayload({
        api,
        address: walletAddress ?? "",
        extrinsic,
      });

      // Submit the transaction
      const result = await api.tx(signedExtrinsic).send();

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
    approveFp,
  };
}
