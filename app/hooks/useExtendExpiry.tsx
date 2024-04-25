import { useReadContract, useWriteContract } from "wagmi";
import { isEmpty } from "lodash";
import { Address, encodeFunctionData, erc20Abi, parseUnits } from "viem";
import { PAYMENT_METHOD, SECONDS } from "@/services/constants";
import { RentPrice, Response } from "@/services/interfaces";
import { Payment } from "@/redux/domain/domainSlice";
import { simulateContract, waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/chains/config";
import { useState } from "react";

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

  payment?: Payment;

  isEnabled?: boolean;
}

export interface RenewProps {
  name: string;
  duration: number;
  owner: Address | undefined;
  fees: {
    rent: number;
    totalFee: number;
  };
}

export interface ApprovalProps {
  fee: number;
}

/** TODO: Optimize this hook */
export default function useExtend(props: ExtendProps) {
  const { name, year, owner, payment = PAYMENT_METHOD[0], isEnabled } = props;

  const controller = useContractDetails({ action: "RegistrarController" });

  const { abi, address } = controller;
  const { writeContractAsync } = useWriteContract();

  const [isExtendLoading, setExtendLoading] = useState(false);

  const duration = year * SECONDS;
  const token = payment.address;

  // #1. Get the estimated gas fee to be used in Transaction Fee field
  const encodedFunction = encodeFunctionData({
    abi,
    functionName: "renewWithERC20",
    args: [name, duration, token],
  });

  const { estimatedGas, gasPrice } = useEstimateRegistration({
    encodedFunction,
    owner,
  });

  // #2. Get the rent price based on the name and duration
  const { data: rentPrice } = useReadContract({
    abi,
    address,
    functionName: "rentERC20Price",
    args: [token, name, duration],
    query: { enabled: !isEmpty(name) && isEnabled },
  });

  const handleExtend = async (props: RenewProps) => {
    const { name, duration, fees } = props;
    const response: Response = { error: null, isSuccess: false, data: null };

    if (name && duration) {
      try {
        const renewResponse = await writeContractAsync({
          abi,
          address,
          functionName: "renewWithERC20",
          account: owner,
          args: [name, duration, token],
        });
        setExtendLoading(true);

        const receipt = await waitForTransactionReceipt(config, {
          hash: renewResponse,
        });

        response.isSuccess = true;
        response.data = {
          hash: renewResponse,
          receipt,
        };
      } catch (error) {
        response.error = error as string;
      }
    }

    setExtendLoading(false);
    console.log("extend response:: ", response);
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
    isLoading: isExtendLoading,
    isExtendLoading,
  };
}
