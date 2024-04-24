import { useWriteContract } from "wagmi";
import { Address, namehash } from "viem";
import { Response } from "@/services/interfaces";
import { getEnsText } from "viem/actions";
import { config, publicClient } from "@/chains/config";
import { normalize } from "viem/ens";
import { EMPTY_ADDRESS } from "@/services/constants";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useState } from "react";

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
  futurePassAddress?: Address;
}

export interface PrimaryName {
  name?: string;
  address?: Address;
}

export interface RecordProps {
  type: "TextRecord" | "AddressRecord" | "PrimaryName";
}

export default function useRecords(props?: RecordProps) {
  const universal = useContractDetails({ action: "UniversalResolver" });
  const ownedResolver = useContractDetails({ action: "OwnedResolver" });
  const publicResolver = useContractDetails({ action: "PublicResolver" });

  const { writeContractAsync } = useWriteContract();

  const [isAddressLoading, setIsAddressLoading] = useState(false);

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

        const receipt = await waitForTransactionReceipt(config, {
          hash: recordResponse,
        });

        response.isSuccess = true;
        response.data = {
          hash: recordResponse,
          receipt,
        };
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
    const { name, address, resolverAddress } = props;
    const response: Response = { error: null, isSuccess: false, data: null };

    if (name && resolverAddress && address) {
      const nameHash = namehash(name);
      const addr = address as Address;

      try {
        const addressResponse = await writeContractAsync({
          abi: publicResolver.abi,
          address: publicResolver.address,
          functionName: "setAddr",
          args: [nameHash, addr],
        });
        // will only set the loading flag as soon as the transasction is approved
        setIsAddressLoading(true);

        const receipt = await waitForTransactionReceipt(config, {
          hash: addressResponse,
        });

        response.isSuccess = true;
        response.data = {
          hash: addressResponse,
          receipt,
        };
      } catch (error) {
        response.error = error as string;
      }
    }

    setIsAddressLoading(false);
    return response;
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
        setIsAddressLoading(true);

        const receipt = await waitForTransactionReceipt(config, {
          hash: removeResponse,
        });

        response.isSuccess = true;
        response.data = {
          hash: removeResponse,
          receipt,
        };
      } catch (error) {
        console.log("error:: ", error);
        response.error = error as string;
      }
    }

    setIsAddressLoading(false);
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

  const getLoadingStatus = () => {
    const type = props?.type || "AddressRecord";
    switch (type) {
      case "AddressRecord":
      default:
        return isAddressLoading;
    }
  };

  return {
    setTextRecord: handleTextRecord,
    setAddressRecord: handleAddressRecord,
    setFuturePassRecord: handleAddressRecord,
    removeAddress: handleRemoveAddress,
    getTextRecord,

    /**
     * Loading Flags
     */
    isLoading: getLoadingStatus(),
    isAddressLoading,
  };
}
