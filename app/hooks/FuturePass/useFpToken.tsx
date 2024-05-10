import "@therootnetwork/api-types"; // optional, for Typescript support
import { useAccount } from "wagmi";
import { Address, encodeFunctionData, erc20Abi, toHex } from "viem";
import { signExtrinsicPayload } from "@/utils/futurepass";
import { useEffect, useState } from "react";
import { ApiPromise } from "@polkadot/api";
import { Contract } from "ethers";
import { CALL_TYPE } from "@/interfaces/futurepass/types";

import useConnectRoot from "../useConnectRoot";
import useEstimateFees from "../useEstimateFees";
import useFuturePass from "./useFuturePass";

export interface TokenProps {
  fpAccount?: Address;
  spender: Address;
  tokenAddr: Address;
  amount: bigint;
}

export default function useFpToken() {
  // const { getApiPromise } = useConnectRoot();
  const { address: walletAddress } = useAccount();
  const { getEstimatedGas, getMaxFeePerGas } = useEstimateFees();
  const { getFuturepassContract, signer } = useFuturePass();

  const [api, setApiPromise] = useState<ApiPromise>();

  const getERCContract = (address: string) => {
    const contract = new Contract(address, erc20Abi, signer);

    return contract;
  };

  const approveTokenProxyCall = async (props: TokenProps) => {
    const { fpAccount, spender, tokenAddr, amount } = props;

    if (fpAccount) {
      const fpContract = getFuturepassContract(fpAccount);
      const ercContract = getERCContract(tokenAddr);

      const approvalData = ercContract.interface.encodeFunctionData("approve", [
        spender,
        amount,
      ]);

      // Estimate Contract Gas
      const gasLimit = await getEstimatedGas({
        account: walletAddress as Address,
        contractAddr: tokenAddr,
        data: approvalData as Address,
      });

      // Get Fee History
      const maxFeePerGas = await getMaxFeePerGas();

      // Get encoded ProxyCall data
      const proxyData = fpContract.interface.encodeFunctionData("proxyCall", [
        CALL_TYPE.Call,
        tokenAddr,
        0,
        approvalData,
      ]) as Address;

      // Send the proxy transaction
      try {
        const ethTx = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              to: fpAccount,
              from: walletAddress,
              gas: toHex(gasLimit),
              value: 0,
              data: proxyData,
              gasPrice: toHex(maxFeePerGas),
            },
          ],
        });
        return ethTx;
      } catch (error) {
        console.log("error:: ", error);
        throw new Error("Error has been encountered");
      }
    }
  };

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
      // const api = await getApiPromise();
      // setApiPromise(api);
    };

    initialize();
  }, []);

  return {
    approveFp,
    approveTokenProxyCall,
  };
}
