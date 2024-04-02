import { useWriteContract } from "wagmi";
import { Address, namehash } from "viem";
import { Response } from "@/services/interfaces";
import { getEnsText } from "viem/actions";
import { publicClient } from "@/chains/config";
import { normalize } from "viem/ens";
import { EMPTY_ADDRESS } from "@/services/constants";
import useContractDetails from "./useContractDetails";

export interface Record {
  name?: string;
  address?: Address;
  key?: string;
  value?: string;
  resolverAddress?: Address;
  owner?: Address;
}

export interface FuturePassRecord extends Record {
  futurePassAddress: Address;
}

export interface PrimaryName {
  name?: string;
  address?: Address;
}

export default function useRecords() {
  const reverse = useContractDetails({ action: "ReverseRegistrar" });
  const universal = useContractDetails({ action: "UniversalResolver" });
  const ownedResolver = useContractDetails({ action: "OwnedResolver" });
  const publicResolver = useContractDetails({ action: "PublicResolver" });

  const { writeContractAsync } = useWriteContract();

  const handlePrimaryName = async (props: PrimaryName) => {
    const { name } = props;
    const response: Response = { error: null, isSuccess: false, data: null };

    if (name) {
      try {
        const nameHash = namehash(name);
        const primaryResponse = await writeContractAsync({
          abi: reverse.abi,
          address: reverse.address,
          functionName: "setName",
          args: [nameHash],
        });

        console.log("response:: ", response);
        response.isSuccess = true;
        response.data = primaryResponse;
      } catch (error) {
        console.log("error:: ", error);
        response.error = error as string;
      }
    }
    return response;
  };

  /**
   *
   * Writes Text Record
   * https://github.com/ensdomains/ensjs-v3/blob/7e01ad8579c08b453fc64b1972b764b6d884b774/packages/ensjs/src/functions/wallet/deleteSubname.ts#L106
   * @param props
   * @returns
   */
  const handleTextRecord = async (props: Record) => {
    const { name, key, value } = props;
    const response: Response = { error: null, isSuccess: false, data: null };

    if (name && key && value) {
      const nameHash = namehash(name);
      try {
        const recordResponse = await writeContractAsync({
          abi: ownedResolver.abi,
          address: ownedResolver.address,
          functionName: "setText",
          args: [nameHash, key, value],
        });

        console.log("record-response:: ", response);
        response.isSuccess = true;
        response.data = recordResponse;
      } catch (error) {
        console.log("error:: ", error);
        response.error = error as string;
      }
    }

    return response;
  };

  /**
   * Test Data: 0xFfFFFFff00000000000000000000000000038E08
   * @param props
   * @returns
   */
  const handleAddressRecord = async (props: FuturePassRecord) => {
    const { name, futurePassAddress, resolverAddress } = props;
    const response: Response = { error: null, isSuccess: false, data: null };
    console.log("props:: ", props);

    if (name && resolverAddress) {
      const nameHash = namehash(name);

      try {
        const addressResponse = await writeContractAsync({
          abi: publicResolver.abi,
          address: publicResolver.address,
          functionName: "setAddr",
          args: [nameHash, futurePassAddress],
        });

        console.log("address-response:: ", addressResponse);
        response.isSuccess = true;
        response.data = addressResponse;
      } catch (error) {
        console.log("error:: ", error);
        response.error = error as string;
      }
    }

    return response;
  };

  const getTextRecord = async (props: Record) => {
    const { name } = props;
    const response: Response = { error: null, isSuccess: false, data: null };

    if (name) {
      try {
        const ensRecordResponse = await getEnsText(publicClient, {
          name: normalize(name),
          key: "futurepass",
          universalResolverAddress: universal.address,
        });

        console.log("record-response:: ", ensRecordResponse);
        response.isSuccess = true;
        response.data = ensRecordResponse;
      } catch (error) {
        console.log("error:: ", error);
        response.error = error as string;
      }
    }
  };

  const handleUpdateAddress = async () => {
    // TODO: implement edit resolver
  };

  const handleRemoveAddress = async (props: Record) => {
    const { name } = props;
    const response: Response = { error: null, isSuccess: false, data: null };

    if (name) {
      const nameHash = namehash(name);

      try {
        const removeResponse = await writeContractAsync({
          abi: publicResolver.abi,
          address: publicResolver.address,
          functionName: "setAddr",
          // TODO: how did ens allow null to remove the address but not the contract
          args: [nameHash, EMPTY_ADDRESS],
        });

        console.log("remove-response:: ", removeResponse);
        response.isSuccess = true;
        response.data = removeResponse;
      } catch (error) {
        console.log("error:: ", error);
        response.error = error as string;
      }
    }

    return response;
  };

  return {
    setTextRecord: handleTextRecord,
    setAddressRecord: handleAddressRecord,
    setFuturePassRecord: handleAddressRecord,
    setPrimaryName: handlePrimaryName,
    removeAddress: handleRemoveAddress,
    getTextRecord,
  };
}
