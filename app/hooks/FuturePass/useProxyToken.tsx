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
  const { sendProxyCallNoGas } = useSendProxyCall();

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
      const transaction = await sendProxyCallNoGas({
        evmContract: {
          address: tokenAddr as Address,
          data: approvalData as Address,
        },
      });

      console.log("Approval-Transaction:: ", transaction);
      return transaction;
    } catch (error) {
      console.log("Approval-Error:: ", error);
      throw new Error((error as any).message);
    }
  };

  return {
    approveProxyCall,
  };
}
