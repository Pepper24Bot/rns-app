import "@therootnetwork/api-types"; // optional, for Typescript support
import { useAccount } from "wagmi";
import { Address, erc20Abi, toHex } from "viem";
import { Contract } from "ethers";
import { CALL_TYPE } from "@/interfaces/futurepass/types";

import useEstimateFees from "../useEstimateFees";
import useFuturePass from "./useFuturePass";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";

export interface TokenProps {
  fpAccount?: Address;
  spender: Address;
  tokenAddr: Address;
  amount: bigint;
}

export default function useProxyToken() {
  const { address: walletAddress } = useAccount();
  const { getEstimatedGas, getMaxFeePerGas } = useEstimateFees();
  const { getFuturepassContract, signer } = useFuturePass();

  const { useRootNetwork } = useRootNetworkState();
  const {
    data: { futurePassAddress: fpAccount },
  } = useRootNetwork();

  const getERCContract = (address: string) => {
    return new Contract(address, erc20Abi, signer);
  };

  const approveProxyCall = async (props: TokenProps) => {
    const { spender, tokenAddr, amount } = props;

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
        throw new Error("Error has been encountered during approval");
      }
    }
  };

  return {
    approveProxyCall,
  };
}
