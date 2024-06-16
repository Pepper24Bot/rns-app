import { Address } from "viem";
import { CALL_TYPE } from "@/interfaces/futurepass/types";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { useAccount } from "wagmi";
import { sendTransaction } from "@wagmi/core";
import { config } from "@/chains/config";

import useEstimateFees from "../useEstimateFees";
import useFuturePass from "./useFuturePass";
import useErrorMessage from "../useErrorMessage";

export interface SendProxyProps {
  evmContract: {
    address: Address;
    data: Address;
  };
}

export default function useSendProxyCall() {
  const { address: wallet = "0x" } = useAccount();
  const { getFuturepassContract } = useFuturePass();
  const { getEstimatedGas, getMaxFeePerGas } = useEstimateFees();
  const { useRootNetwork } = useRootNetworkState();
  const { getProxyErrorMessage } = useErrorMessage();
  const {
    data: { futurePassAddress: futurePass },
  } = useRootNetwork();

  const sendProxyCall = async (props: SendProxyProps) => {
    const { evmContract } = props;

    if (futurePass) {
      const fpContract = getFuturepassContract(futurePass);

      // Estimate Contract Gas
      const gasLimit = await getEstimatedGas({
        account: wallet,
        contractAddr: evmContract.address,
        data: evmContract.data,
      });

      // Get Fee History
      const maxFeePerGas = await getMaxFeePerGas();

      // Get encoded ProxyCall data
      const proxyData = fpContract.interface.encodeFunctionData("proxyCall", [
        CALL_TYPE.Call,
        evmContract.address,
        0,
        evmContract.data,
      ]) as Address;

      try {
        // Send the proxy transaction
        const ethTx = await sendTransaction(config, {
          to: futurePass as Address,
          account: wallet,
          value: BigInt(0),
          data: proxyData,
          gas: BigInt(gasLimit),
          gasPrice: BigInt(maxFeePerGas),
        });

        return ethTx;
      } catch (error) {
        console.log("proxycall-error:: ", (error as any).message);
        const message = getProxyErrorMessage((error as any).message);
        throw new Error(message);
      }
    }
  };

  const sendProxyCallNoGas = async (props: SendProxyProps) => {
    const { evmContract } = props;

    if (futurePass) {
      const fpContract = getFuturepassContract(futurePass);

      // Get Fee History
      const maxFeePerGas = await getMaxFeePerGas();

      // Get encoded ProxyCall data
      const proxyData = fpContract.interface.encodeFunctionData("proxyCall", [
        CALL_TYPE.Call,
        evmContract.address,
        0,
        evmContract.data,
      ]) as Address;

      try {
        // Send the proxy transaction
        const ethTx = await sendTransaction(config, {
          to: futurePass as Address,
          account: wallet,
          value: BigInt(0),
          data: proxyData,
          gasPrice: BigInt(maxFeePerGas),
        });

        return ethTx;
      } catch (error) {
        console.log("proxycall-error:: ", (error as any).message);
        const message = getProxyErrorMessage((error as any).message);
        throw new Error(message);
      }
    }
  };

  return {
    sendProxyCall,
    sendProxyCallNoGas,
  };
}
