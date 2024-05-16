import { useWriteContract } from "wagmi";
import { useState } from "react";
import { ErrorResponse } from "@/services/interfaces";
import { Address, namehash } from "viem";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { TransferProps } from "@/interfaces/transfer";
import { initializeResponse } from "@/utils/common";

import useContractDetails from "./useContractDetails";
import useProxyTransfer from "./FuturePass/useProxyTransfer";
import useWaitTransaction from "./useWaitTransaction";

/** TODO: Optimize this hook */
export default function useTransfer() {
  const nameWrapper = useContractDetails({ action: "NameWrapper" });

  const { useRootNetwork } = useRootNetworkState();
  const { data: root } = useRootNetwork();
  const { waitForWriteTransaction } = useWaitTransaction();
  const { writeContractAsync } = useWriteContract();
  const { transferProxyCall } = useProxyTransfer({
    nameWrapper: nameWrapper,
  });

  const [isTransferLoading, setTransferLoading] = useState(false);

  const handleTransfer = async (props: TransferProps) => {
    const { name, newOwner } = props;
    let response = { ...initializeResponse() };

    if (name && newOwner && root.address) {
      try {
        const nameHash = namehash(name);
        const tokenId = BigInt(nameHash);
        const amount = BigInt(1);

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

        setTransferLoading(true);
        response = await waitForWriteTransaction(transferHash);
      } catch (e) {
        const error = e as ErrorResponse;
        response.error = error;
      }
    }
    setTransferLoading(false);
    console.log("Transfer-Response:: ", response);
    return response;
  };

  return {
    transfer: handleTransfer,
    isLoading: isTransferLoading,
  };
}
