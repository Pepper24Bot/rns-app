import "@therootnetwork/api-types"; // optional, for Typescript support
import { Address, erc20Abi } from "viem";
import { Contract } from "ethers";
import useSendProxyCall from "./useSendProxyCall";

export interface TokenProps {
  spender: Address;
  tokenAddr: Address;
  amount: bigint;
}

export default function useProxyToken() {
  const { sendProxyCall } = useSendProxyCall();

  const getErcContract = (address: string) => {
    return new Contract(address, erc20Abi);
  };

  const approveProxyCall = async (props: TokenProps) => {
    const { spender, tokenAddr, amount } = props;

    const ercContract = getErcContract(tokenAddr);
    const approvalData = ercContract.interface.encodeFunctionData("approve", [
      spender,
      amount,
    ]);

    try {
      const transaction = await sendProxyCall({
        evmContract: {
          address: tokenAddr as Address,
          data: approvalData as Address,
        },
      });

      console.log("approve-token-transaction:: ", transaction);
      return transaction;
    } catch (error) {
      console.log("error:: ", error);
      throw new Error("Error has been encountered during approval");
    }
  };

  return {
    approveProxyCall,
  };
}
