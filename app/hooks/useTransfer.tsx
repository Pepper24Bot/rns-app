import { useWriteContract } from "wagmi";
import { config } from "@/chains/config";
import { useState } from "react";
import { waitForTransactionReceipt } from "@wagmi/core";
import { ErrorResponse, Response } from "@/services/interfaces";
import { Address, namehash } from "viem";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { TransferProps } from "@/interfaces/transfer";

import useContractDetails from "./useContractDetails";
import useProxyTransfer from "./FuturePass/useProxyTransfer";

/** TODO: Optimize this hook */
export default function useTransfer() {
  const { useRootNetwork } = useRootNetworkState();
  const { data: root } = useRootNetwork();

  const nameWrapper = useContractDetails({ action: "NameWrapper" });

  const { writeContractAsync } = useWriteContract();
  const { transferProxyCall } = useProxyTransfer({
    nameWrapper: nameWrapper,
  });

  const [isTransferLoading, setTransferLoading] = useState(false);

  const initializeResponse = (): Response => {
    return { error: null, isSuccess: false, data: null };
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

  const handleTransfer = async (props: TransferProps) => {
    const { name, newOwner } = props;
    let response = { ...initializeResponse() };

    if (name && newOwner && root.address) {
      const nameHash = namehash(name);
      const tokenId = BigInt(nameHash);
      const amount = BigInt(1);

      try {
        let transferHash = "0x" as Address;

        if (root.isFpActive) {
          transferHash = await transferProxyCall({
            fromOwner: root.address,
            newOwner,
            tokenId,
            amount,
          });
        } else {
          transferHash = await writeContractAsync({
            abi: nameWrapper.abi,
            address: nameWrapper.address,
            functionName: "safeTransferFrom",
            account: root.address as Address,
            args: [root.address, newOwner, tokenId, amount, "0x"],
          });
        }

        console.log("hash:: ", transferHash);
        setTransferLoading(true);
        response = await waitForTransaction(transferHash);
      } catch (e) {
        const error = e as ErrorResponse;
        response.error = error;
      }
    }
    setTransferLoading(false);
    console.log("transfer response:: ", response);
    return response;
  };

  return {
    transfer: handleTransfer,
    isLoading: isTransferLoading,
  };
}
