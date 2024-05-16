import "@therootnetwork/api-types"; // optional, for Typescript support
import { Address } from "viem";
import { Contract } from "ethers";
import { RenewProps } from "@/interfaces/expiry";
import { ProxyProps } from "@/interfaces/proxy";
import useSendProxyCall from "./useSendProxyCall";

export default function useProxyExtend(props: ProxyProps) {
  const { registrarController } = props;
  const { sendProxyCallNoGas } = useSendProxyCall();

  const controller = registrarController!; // assert to always be not undefined
  const getEthContract = () => {
    return new Contract(controller.address, controller.abi);
  };

  const extendProxyCall = async (props: RenewProps) => {
    const { name, duration, token } = props;

    if (name && duration) {
      const ethContract = getEthContract();
      const extendData = ethContract.interface.encodeFunctionData(
        "renewWithERC20",
        [name, duration, token]
      );

      try {
        const transaction = await sendProxyCallNoGas({
          evmContract: {
            address: ethContract.address as Address,
            data: extendData as Address,
          },
        });

        console.log("ExtendExpiry-Transaction:: ", transaction);
        return transaction;
      } catch (error) {
        console.log("error:: ", error);
        throw new Error("Error has been encountered during extend");
      }
    }
  };

  return {
    extendProxyCall,
  };
}
