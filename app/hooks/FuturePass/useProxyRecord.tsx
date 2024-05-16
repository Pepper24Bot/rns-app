import "@therootnetwork/api-types"; // optional, for Typescript support
import { Address } from "viem";
import { Contract } from "ethers";
import { ProxyProps } from "@/interfaces/proxy";
import { RecordProps } from "@/interfaces/record";
import useSendProxyCall from "./useSendProxyCall";

export default function useProxyRecord(props: ProxyProps) {
  const { publicResolver } = props;
  const { sendProxyCallNoGas } = useSendProxyCall();

  const resolver = publicResolver!; // assert to always be not undefined
  const getResolverContract = () => {
    return new Contract(resolver.address, resolver.abi);
  };

  const setAddressProxyCall = async (props: RecordProps) => {
    const { nameHash, address } = props;

    if (nameHash) {
      const resolverContract = getResolverContract();
      const addressData = resolverContract.interface.encodeFunctionData(
        "setAddr(bytes32,address)",
        [nameHash, address]
      );

      try {
        const transaction = await sendProxyCallNoGas({
          evmContract: {
            address: resolverContract.address as Address,
            data: addressData as Address,
          },
        });

        console.log("SetAddress-Transaction:: ", transaction);
        return transaction;
      } catch (error) {
        console.log("error:: ", error);
        throw new Error("Error has been encountered during setting a record");
      }
    }
  };

  return {
    setAddressProxyCall,
  };
}
