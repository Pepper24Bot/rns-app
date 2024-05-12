import "@therootnetwork/api-types"; // optional, for Typescript support
import { Address } from "viem";
import { Contract } from "ethers";
import { ProxyProps } from "@/interfaces/proxy";
import { FuturePassRecord } from "@/interfaces/record";
import useSendProxyCall from "./useSendProxyCall";

export default function useProxyRecord(props: ProxyProps) {
  const { publicResolver } = props;
  const { sendProxyCall } = useSendProxyCall();

  const resolver = publicResolver!; // assert to always be not undefined
  const getResolverContract = () => {
    return new Contract(resolver.address, resolver.abi);
  };

  const setAddressProxyCall = async (props: FuturePassRecord) => {
    const { nameHash, address } = props;

    if (nameHash) {
      const resolverContract = getResolverContract();
      const addressData = resolverContract.interface.encodeFunctionData(
        "setAddr(bytes32,address)",
        [nameHash, address as Address]
      );

      try {
        const transaction = await sendProxyCall({
          evmContract: {
            address: resolverContract.address as Address,
            data: addressData as Address,
          },
        });

        console.log("address-record-transaction:: ", transaction);
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
