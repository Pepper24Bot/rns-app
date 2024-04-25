import useContractDetails from "./useContractDetails";
import { useWriteContract } from "wagmi";
import { Address, erc20Abi, parseUnits } from "viem";
import { Response } from "@/services/interfaces";
import { Payment } from "@/redux/domain/domainSlice";
import { PAYMENT_METHOD } from "@/services/constants";
import { simulateContract, waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/chains/config";
import { useState } from "react";

export interface ApprovalProps {
  payment?: Payment;
  fee: number;
}

export default function useTokenApproval() {
  const controller = useContractDetails({ action: "RegistrarController" });

  const { address } = controller;
  const { writeContractAsync } = useWriteContract();

  const [isApprovalLoading, setApprovalLoading] = useState(false);

  const initializeResponse = (): Response => {
    return { error: null, isSuccess: false, data: null };
  };

  // TODO: Implement block latency here
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

  /**
   *
   * @param props
   * @returns
   */
  const handleApproval = async (props: ApprovalProps) => {
    const { payment = PAYMENT_METHOD[0], fee } = props;

    let response = { ...initializeResponse() };

    const spender = address as Address;
    const tokenAddr = payment?.address as Address;
    const value = parseUnits(fee.toString(), payment?.decimals);

    try {
      const token = await simulateContract(config, {
        abi: erc20Abi,
        address: tokenAddr,
        functionName: "approve",
        args: [spender, value],
      });
      const hash = await writeContractAsync(token.request);
      setApprovalLoading(true);

      response = await waitForTransaction(hash);
    } catch (error) {
      response.error = error as string;
    }

    setApprovalLoading(false);
    return response;
  };

  return {
    approve: handleApproval,
    isApprovalLoading,
  };
}
