import { useWriteContract } from "wagmi";
import { Address, namehash } from "viem";
import { ErrorResponse, Response } from "@/services/interfaces";
import { config } from "@/chains/config";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useState } from "react";

import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { FuturePassRecord } from "@/interfaces/record";
import useContractDetails from "./useContractDetails";
import useProxyRecord from "./FuturePass/useProxyRecord";

export interface RecordProps {
  type: "TextRecord" | "AddressRecord";
}

export default function useRecords() {
  const publicResolver = useContractDetails({ action: "PublicResolver" });

  const { setAddressProxyCall } = useProxyRecord({ publicResolver });
  const { writeContractAsync } = useWriteContract();
  const { useRootNetwork } = useRootNetworkState();
  const { data: root } = useRootNetwork();

  const [isAddressLoading, setIsAddressLoading] = useState(false);

  const initializeResponse = (): Response => {
    return {
      error: null,
      isSuccess: false,
      data: {
        hash: "",
        receipt: "",
      },
    };
  };

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
   * 0x8F8faa9eBB54DEda91a62B4FC33550B19B9d33bf
   * @param props
   * @returns
   */
  const handleAddressRecord = async (props: FuturePassRecord) => {
    const { name, address } = props;

    let response = { ...initializeResponse() };

    if (name && address) {
      try {
        let txHash = "0x" as Address;
        const nameHash = namehash(name);
        const addr = address as Address;

        if (root.isFpActive) {
          txHash = await setAddressProxyCall({
            nameHash,
            address,
          });
        } else {
          txHash = await writeContractAsync({
            abi: publicResolver.abi,
            address: publicResolver.address,
            functionName: "setAddr",
            args: [nameHash, addr],
          });
        }

        // will only set the loading flag as soon as the transasction is approved
        setIsAddressLoading(true);
        response = await waitForTransaction(txHash);
      } catch (e) {
        const error = e as ErrorResponse;
        response.error = error;
      }
    }

    console.log("address-record:: ", response);
    setIsAddressLoading(false);
    return response;
  };

  return {
    setAddressRecord: handleAddressRecord,
    isLoading: isAddressLoading,
    isAddressLoading,
  };
}
