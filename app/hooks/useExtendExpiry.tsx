import { useReadContract, useWriteContract } from "wagmi";
import { isEmpty } from "lodash";
import { Address, encodeFunctionData, parseEther } from "viem";
import { PAYMENT_METHOD, SECONDS } from "@/services/constants";
import { RentPrice, Response } from "@/services/interfaces";
import { Payment } from "@/redux/domain/domainSlice";

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

export default function useExtend(props: ExtendProps) {
  const { name, year, owner, payment = PAYMENT_METHOD[0] } = props;

  const controller = useContractDetails({ action: "RegistrarController" });

  const { writeContractAsync: renewAsync } = useWriteContract();
  const { abi, address } = controller;

  const duration = year * SECONDS;
  const token = payment.address;

  // #1. Get the estimated gas fee to be used in Transaction Fee field
  const encodedFunction = encodeFunctionData({
    abi,
    // functionName: "renew",
    // args: [name, duration],
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
    // functionName: "rentPrice",
    // args: [name, duration],
    functionName: "rentERC20Price",
    args: [token, name, duration],
    query: { enabled: !isEmpty(name) },
  });

  const handleExtend = async (props: RenewProps) => {
    const { name, duration, fees } = props;
    const response: Response = { error: null, isSuccess: false, data: null };

    const value = parseEther(fees.totalFee.toString());

    if (name && duration) {
      try {
        const renewResponse = await renewAsync({
          abi,
          address,
          // functionName: "renew",
          // args: [name, duration],
          functionName: "renewWithERC20",
          account: owner,
          value: value,
          args: [name, duration, token],
        });

        response.data = renewResponse;
        response.isSuccess = true;
      } catch (error) {
        response.error = error as string;
      }
    }

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
  };
}
