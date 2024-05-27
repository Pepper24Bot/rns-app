import { useWriteContract } from "wagmi";
import { useState } from "react";
import { ErrorResponse } from "@/services/interfaces";
import { Address, namehash } from "viem";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { TransferProps } from "@/interfaces/transfer";
import { initializeResponse } from "@/utils/common";
import { useSnackbar } from "notistack";

import useContractDetails from "./useContractDetails";
import useProxyTransfer from "./FuturePass/useProxyTransfer";
import useWaitTransaction from "./useWaitTransaction";

/** TODO: Optimize this hook */
export default function useTransfer() {
  const nameWrapper = useContractDetails({ action: "NameWrapper" });

  const { enqueueSnackbar } = useSnackbar();
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

        enqueueSnackbar(`Transferring ${name} is in progress.`, {
          variant: "info",
        });
        setTransferLoading(true);
        response = await waitForWriteTransaction(transferHash);
      } catch (e) {
        const error = e as ErrorResponse;
        response.error = error;
        const message = error.shortMessage || error.message;
        enqueueSnackbar(message, { variant: "error" });
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
