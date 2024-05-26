import { useWriteContract } from "wagmi";
import { Address, namehash } from "viem";
import { ErrorResponse } from "@/services/interfaces";
import { useState } from "react";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { RecordProps } from "@/interfaces/record";
import { initializeResponse } from "@/utils/common";
import { useSnackbar } from "notistack";

import useContractDetails from "./useContractDetails";
import useProxyRecord from "./FuturePass/useProxyRecord";
import useWaitTransaction from "./useWaitTransaction";

export default function useRecords() {
  const publicResolver = useContractDetails({ action: "PublicResolver" });

  const { enqueueSnackbar } = useSnackbar();
  const { writeContractAsync } = useWriteContract();
  const { useRootNetwork } = useRootNetworkState();
  const { data: root } = useRootNetwork();
  const { waitForWriteTransaction } = useWaitTransaction();
  const { setAddressProxyCall } = useProxyRecord({ publicResolver });

  const [isAddressLoading, setIsAddressLoading] = useState(false);

  /**
   *
   * @param props
   * @returns
   */
  const handleAddressRecord = async (props: RecordProps) => {
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
            address: addr,
          });
        } else {
          txHash = await writeContractAsync({
            abi: publicResolver.abi,
            address: publicResolver.address,
            functionName: "setAddr",
            args: [nameHash, addr],
          });
        }

        setIsAddressLoading(true);
        response = await waitForWriteTransaction(txHash);
      } catch (e) {
        const error = e as ErrorResponse;
        response.error = error;
        enqueueSnackbar(error.shortMessage, { variant: "error" });
      }
    }

    console.log("AddressRecord-Response:: ", response);
    setIsAddressLoading(false);
    return response;
  };

  return {
    setAddressRecord: handleAddressRecord,
    isLoading: isAddressLoading,
    isAddressLoading,
  };
}
