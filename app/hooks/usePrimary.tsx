import { useWriteContract } from "wagmi";
import { Address } from "viem";
import { ErrorResponse } from "@/services/interfaces";
import { config } from "@/chains/config";
import { readContract } from "@wagmi/core";
import { useState } from "react";
import { PrimaryNameProps } from "@/interfaces/primary";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { initializeResponse } from "@/utils/common";
import { useSnackbar } from "notistack";

import useContractDetails from "./useContractDetails";
import useProxyPrimary from "./FuturePass/useProxyPrimary";
import useWaitTransaction from "./useWaitTransaction";

export default function usePrimary() {
  const reverse = useContractDetails({ action: "ReverseRegistrar" });
  const publicResolver = useContractDetails({ action: "PublicResolver" });

  const { enqueueSnackbar } = useSnackbar();
  const { useRootNetwork } = useRootNetworkState();
  const { data: root } = useRootNetwork();
  const { waitForWriteTransaction } = useWaitTransaction();
  const { writeContractAsync } = useWriteContract();
  const { setPrimaryProxyCall } = useProxyPrimary({
    reverseRegistrar: reverse,
  });

  const [isPrimaryLoading, setIsPrimaryLoading] = useState(false);

  /**
   *
   * @param props
   * @returns
   */
  const getPrimaryName = async (props: PrimaryNameProps) => {
    const { domainId = "" } = props;
    const response = { ...initializeResponse() };

    try {
      setIsPrimaryLoading(true);
      const primaryResponse = await readContract(config, {
        abi: publicResolver.abi,
        address: publicResolver.address,
        functionName: "name",
        args: [domainId],
      });

      response.isSuccess = true;
      response.data = primaryResponse;
    } catch (e) {
      const error = e as ErrorResponse;
      response.error = error;
      enqueueSnackbar(error.shortMessage, { variant: "error" });
    }

    setIsPrimaryLoading(false);
    return response;
  };

  /**
   *
   * @param props
   * @returns
   */
  const handlePrimaryName = async (props: PrimaryNameProps) => {
    const { name, resolverAddress } = props;
    let response = { ...initializeResponse() };

    if (name && resolverAddress) {
      try {
        let primaryHash = "0x" as Address;

        if (root.isFpActive) {
          primaryHash = await setPrimaryProxyCall({ name });
        } else {
          primaryHash = await writeContractAsync({
            abi: reverse.abi,
            address: reverse.address,
            functionName: "setName",
            args: [name],
          });
        }

        enqueueSnackbar(
          "Setting this identity as your primary is in progress.",
          { variant: "info" }
        );
        setIsPrimaryLoading(true);
        response = await waitForWriteTransaction(primaryHash);
      } catch (e) {
        const error = e as ErrorResponse;
        response.error = error;
        enqueueSnackbar(error.shortMessage, { variant: "error" });
      }
    }

    console.log("SetPrimary-Response:: ", response);
    setIsPrimaryLoading(false);
    return response;
  };

  return {
    setPrimaryName: handlePrimaryName,
    getPrimaryName,
    isLoading: isPrimaryLoading,
  };
}
