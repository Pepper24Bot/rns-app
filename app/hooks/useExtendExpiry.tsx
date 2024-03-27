import { useReadContract, useWriteContract } from "wagmi";
import { isEmpty } from "lodash";
import { Address, encodeFunctionData, parseEther } from "viem";
import { SECONDS } from "@/services/constants";
import { RentPrice, Response } from "@/services/interfaces";

import useContractDetails from "./useContractDetails";
import useEstimateRegistration from "./useEstimateRegistration";

export interface ExtendProps {
  /**
   * name to be registered.
   * raw name, without .root
   */
  name: string;

  /**
   * year count, to be converted into seconds
   */
  year: number;

  owner: Address | undefined;
}

export interface RenewProps {
  name: string;
  duration: number;
  owner: Address | undefined;
  fees: {
    rent: string;
    totalFee: string;
  };
}

export default function useExtend(props: ExtendProps) {
  const { name, year, owner } = props;

  const controller = useContractDetails({ action: "RegistrarController" });
  const { writeContractAsync: renewAsync } = useWriteContract();

  const { abi, address } = controller;

  const duration = year * SECONDS;

  // #1. Get the estimated gas fee to be used in Transaction Fee field
  const encodedFunction = encodeFunctionData({
    abi,
    functionName: "renew",
    args: [name, duration],
  });

  const { estimatedGas, gasPrice } = useEstimateRegistration({
    encodedFunction,
    owner,
  });

  // #2. Get the rent price based on the name and duration
  const { data: rentPrice } = useReadContract({
    abi,
    address,
    functionName: "rentPrice",
    args: [name, duration],
    query: { enabled: !isEmpty(name) },
  });

  const handleExtend = async (props: RenewProps) => {
    const { name, duration, fees } = props;
    const response: Response = { error: null, isSuccess: false, data: null };

    if (name && duration) {
      try {
        const renewResponse = await renewAsync({
          abi,
          address,
          functionName: "renew",
          account: owner,
          value: parseEther(fees.totalFee),
          args: [name, duration],
        });

        response.data = renewResponse;
        response.isSuccess = true;
      } catch (error) {
        response.error = error as string;
      }
    }

    return response;
  };

  const fallBackRent: RentPrice = {
    base: BigInt(0),
    premium: BigInt(0),
  };

  const rentFee = rentPrice
    ? (rentPrice as unknown as RentPrice)
    : fallBackRent;

  return {
    duration,
    estimatedGas,
    estimatedGasPrice: gasPrice,
    rentPrice: rentFee,
    renew: handleExtend,
  };
}
