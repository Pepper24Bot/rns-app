import { Address, toHex } from "viem";
import { CALL_TYPE } from "@/interfaces/futurepass/types";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { useAccount } from "wagmi";

import useEstimateFees from "../useEstimateFees";
import useFuturePass from "./useFuturePass";

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
        const ethTx = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              to: futurePass,
              from: wallet,
              gas: toHex(gasLimit),
              value: 0,
              data: proxyData,
              gasPrice: toHex(maxFeePerGas),
            },
          ],
        });

        return ethTx;
      } catch (error) {
        console.log("proxycall-error:: ", error);
        throw new Error((error as any).message);
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
        const ethTx = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              to: futurePass,
              from: wallet,
              value: 0,
              data: proxyData,
              gasPrice: toHex(maxFeePerGas),
            },
          ],
        });

        return ethTx;
      } catch (error) {
        console.log("proxycall-error:: ", error);
        throw new Error((error as any).message);
      }
    }
  };

  return {
    sendProxyCall,
    sendProxyCallNoGas,
  };
}
