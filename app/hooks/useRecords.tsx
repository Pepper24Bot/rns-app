import { useSendTransaction, useWriteContract } from "wagmi";
import { Address, encodeFunctionData, namehash, toBytes } from "viem";
import { Response } from "@/services/interfaces";
import { getEnsText, simulateContract } from "viem/actions";
import { config, publicClient } from "@/chains/config";
import { normalize } from "viem/ens";
import useContractDetails from "./useContractDetails";
import { estimateGas } from "@wagmi/core/dist/types/exports";

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
  const ens = useContractDetails({ action: "ENS" });
  const reverse = useContractDetails({ action: "ReverseRegistrar" });
  const universal = useContractDetails({ action: "UniversalResolver" });
  const ownedResolver = useContractDetails({ action: "OwnedResolver" });

  const { writeContractAsync: setRecordAsync } = useWriteContract();
  const { writeContractAsync: setPrimaryNameAsync } = useWriteContract();
  const { writeContractAsync: setFuturePassAsync } = useWriteContract();

  const { sendTransaction, error, data, failureReason } = useSendTransaction();

  const handlePrimaryName = async (props: PrimaryName) => {
    const { name } = props;
    const response: Response = { error: null, isSuccess: false, data: null };

    if (name) {
      try {
        const nameHash = namehash(name);
        const primaryResponse = await setPrimaryNameAsync({
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
        const recordResponse = await setRecordAsync({
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
   *
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
        // const addressResponse = await simulateContract(config, {
        //   abi: ownedResolver.abi,
        //   address: ownedResolver.address,
        //   functionName: "setAddr",
        //   args: [nameHash, 60, futurePassAddress],
        // });

        const encodedFunction = encodeFunctionData({
          abi: ownedResolver.abi,
          functionName: "setAddr",
          args: [nameHash, futurePassAddress],
          // args: [nameHash, 60, futurePassAddress],
        });

        const gas = await publicClient.estimateGas({
          account: "0x8f8faa9ebb54deda91a62b4fc33550b19b9d33bf",
          to: "0x8f8faa9ebb54deda91a62b4fc33550b19b9d33bf",
          data: encodedFunction, // 60 = ETH
          // args: [nameHash, 60, futurePassAddress], // 60 = ETH
        });

        console.log("gas-response:: ", gas);

        const addressResponse = await setFuturePassAsync({
          abi: ownedResolver.abi,
          address: ownedResolver.address,
          functionName: "setAddr",
          // args: [nameHash, 60, futurePassAddress], // 60 = ETH
          args: [nameHash, futurePassAddress],
          gas,
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

  const handleUpdateResolver = async () => {
    // TODO: implement edit resolver
  };

  const handleRemoveResolver = async () => {
    // TODO: remove resolver
  };

  return {
    setTextRecord: handleTextRecord,
    setAddressRecord: handleAddressRecord,
    setFuturePassRecord: handleAddressRecord,
    setPrimaryName: handlePrimaryName,
    getTextRecord,
    failureReason,
    error,
    data,
  };
}
