import { useWriteContract } from "wagmi";
import { isEmpty } from "lodash";
import { config } from "@/chains/config";
import { useEffect, useState } from "react";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { ErrorResponse, RentPrice, Response } from "@/services/interfaces";
import { Address, namehash } from "viem";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { TransferProps } from "@/interfaces/transfer";

import useContractDetails from "./useContractDetails";
import useProxyExtend from "./FuturePass/useProxyExtend";

/** TODO: Optimize this hook */
export default function useTransfer() {
  const { useRootNetwork } = useRootNetworkState();
  const { data: root } = useRootNetwork();

  const registry = useContractDetails({ action: "ENSRegistry" });

  const { abi, address } = registry;
  const { writeContractAsync } = useWriteContract();
  //   const { extendProxyCall } = useProxyExtend({
  //     registrarController: controller,
  //   });

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

    const nameHash = namehash(name);
    if (name && newOwner) {
      try {
        if (root.isFpActive) {
        } else {
          const transferHash = await writeContractAsync({
            abi,
            address,
            functionName: "setOwner",
            account: root.address as Address,
            args: [nameHash, newOwner],
          });
          console.log("hash:: ", transferHash);
          setTransferLoading(true);
          response = await waitForTransaction(transferHash);
        }
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
