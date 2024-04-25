import { useWriteContract } from "wagmi";
import { Address, namehash } from "viem";
import { Response } from "@/services/interfaces";
import { config } from "@/chains/config";
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
  const ownedResolver = useContractDetails({ action: "OwnedResolver" });
  const publicResolver = useContractDetails({ action: "PublicResolver" });

  const { writeContractAsync } = useWriteContract();

  const [isAddressLoading, setIsAddressLoading] = useState(false);

  const initializeResponse = (): Response => {
    return { error: null, isSuccess: false, data: null };
  };

  // TODO: Implement block latency here
  const waitForTransaction = async (hash: Address) => {
    const receipt = await waitForTransactionReceipt(config, {
      hash,
    });

    return {
      isSuccess: true,
      error: null,
      data: {
        hash,
        receipt,
      },
    };
  };

  /**
   *
   * @param props
   * @returns
   */
  const handleTextRecord = async (props: Record) => {
    const { name, key, value } = props;

    let response = { ...initializeResponse() };

    if (name && key && value) {
      const nameHash = namehash(name);

      try {
        const hash = await writeContractAsync({
          abi: ownedResolver.abi,
          address: ownedResolver.address,
          functionName: "setText",
          args: [nameHash, key, value],
        });

        response = await waitForTransaction(hash);
      } catch (error) {
        response.error = error as string;
      }
    }

    console.log("textrecord-response:: ", response);
    return response;
  };

  /**
   *
   * @param props
   * @returns
   */
  const handleAddressRecord = async (props: FuturePassRecord) => {
    const { name, address, resolverAddress } = props;

    let response = { ...initializeResponse() };

    if (name && resolverAddress && address) {
      const nameHash = namehash(name);
      const addr = address as Address;

      try {
        const hash = await writeContractAsync({
          abi: publicResolver.abi,
          address: publicResolver.address,
          functionName: "setAddr",
          args: [nameHash, addr],
        });
        // will only set the loading flag as soon as the transasction is approved
        setIsAddressLoading(true);

        response = await waitForTransaction(hash);
      } catch (error) {
        response.error = error as string;
      }
    }

    setIsAddressLoading(false);
    console.log("address-record:: ", response);
    return response;
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

    /**
     * Loading Flags
     */
    isLoading: getLoadingStatus(),
    isAddressLoading,
  };
}
