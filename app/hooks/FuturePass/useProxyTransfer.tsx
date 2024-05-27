import "@therootnetwork/api-types"; // optional, for Typescript support
import { Address } from "viem";
import { Contract } from "ethers";
import { ProxyProps } from "@/interfaces/proxy";
import { TransferProps } from "@/interfaces/transfer";
import useSendProxyCall from "./useSendProxyCall";

export default function useProxyTransfer(props: ProxyProps) {
  const { nameWrapper } = props;
  const { sendProxyCallNoGas } = useSendProxyCall();

  const wrapper = nameWrapper!; // assert to always be not undefined
  const getNameWrapperContract = () => {
    return new Contract(wrapper.address, wrapper.abi);
  };

  const transferProxyCall = async (props: TransferProps) => {
    const { newOwner, fromOwner, tokenId, amount } = props;

    if (fromOwner && newOwner && tokenId) {
      const wrapper = getNameWrapperContract();
      const transferData = wrapper.interface.encodeFunctionData(
        "safeTransferFrom",
        [fromOwner, newOwner, tokenId, amount, "0x"]
      );

      try {
        const transaction = await sendProxyCallNoGas({
          evmContract: {
            address: wrapper.address as Address,
            data: transferData as Address,
          },
        });

        console.log("Transfer-Transaction:: ", transaction);
        return transaction;
      } catch (error) {
        console.log("Transfer-Error:: ", error);
        throw new Error((error as any).message);
      }
    }
  };

  return {
    transferProxyCall,
  };
}
