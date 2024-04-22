import { useWriteContract } from "wagmi";
import { Address } from "viem";
import { Response } from "@/services/interfaces";
import { config } from "@/chains/config";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { useState } from "react";

import useContractDetails from "./useContractDetails";

export interface PrimaryName {
  name?: string;
  address?: Address;
  domainId?: string;
}

export default function usePrimary() {
  const reverse = useContractDetails({ action: "ReverseRegistrar" });
  const publicResolver = useContractDetails({ action: "PublicResolver" });

  const { writeContractAsync } = useWriteContract();

  const [isPrimaryLoading, setIsPrimaryLoading] = useState(false);

  /**
   *
   * @param props
   * @returns
   */
  const handlePrimaryName = async (props: PrimaryName) => {
    const { name } = props;
    const response: Response = { error: null, isSuccess: false, data: null };

    if (name) {
      try {
        const primaryResponse = await writeContractAsync({
          abi: reverse.abi,
          address: reverse.address,
          functionName: "setName",
          args: [name],
        });
        setIsPrimaryLoading(true);

        const receipt = await waitForTransactionReceipt(config, {
          hash: primaryResponse,
        });

        response.isSuccess = true;
        response.data = {
          hash: primaryResponse,
          receipt,
        };
      } catch (error) {
        response.error = error as string;
      }
    }

    console.log("set-response:: ", response);
    setIsPrimaryLoading(false);
    return response;
  };

  /**
   *
   * @param props
   * @returns
   */
  const getPrimaryName = async (props: PrimaryName) => {
    const { domainId = "" } = props;
    const response: Response = { error: null, isSuccess: false, data: null };

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
    } catch (error) {
      response.error = error as string;
    }

    console.log("get-response:: ", response);
    setIsPrimaryLoading(false);
    return response;
  };

  return {
    setPrimaryName: handlePrimaryName,
    getPrimaryName,
    /**
     * Loading Flags
     */
    isLoading: isPrimaryLoading,
  };
}
