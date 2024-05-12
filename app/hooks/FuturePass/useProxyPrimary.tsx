import "@therootnetwork/api-types"; // optional, for Typescript support
import { Address } from "viem";
import { Contract } from "ethers";
import { ProxyProps } from "@/interfaces/proxy";
import { PrimaryName } from "@/interfaces/primary";
import useSendProxyCall from "./useSendProxyCall";

export default function useProxyPrimary(props: ProxyProps) {
  const { reverseRegistrar } = props;
  const { sendProxyCallNoGas } = useSendProxyCall();

  const reverse = reverseRegistrar!; // assert to always be not undefined
  const getResolverContract = () => {
    return new Contract(reverse.address, reverse.abi);
  };

  const setPrimaryProxyCall = async (props: PrimaryName) => {
    const { name } = props;

    if (name) {
      const reverseContract = getResolverContract();
      const primaryData = reverseContract.interface.encodeFunctionData(
        "setName",
        [name]
      );

      try {
        const transaction = await sendProxyCallNoGas({
          evmContract: {
            address: reverseContract.address as Address,
            data: primaryData as Address,
          },
        });

        console.log("primary-name-transaction:: ", transaction);
        return transaction;
      } catch (error) {
        console.log("error:: ", error);
        throw new Error("Error has been encountered during setting a primary");
      }
    }
  };

  return {
    setPrimaryProxyCall,
  };
}
