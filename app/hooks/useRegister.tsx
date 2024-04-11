import { ContractDetails } from "./useContractDetails";
import { useWriteContract } from "wagmi";
import { Address, erc20Abi, parseUnits } from "viem";
import { Response } from "@/services/interfaces";
import { Payment } from "@/redux/domain/domainSlice";
import { PAYMENT_METHOD } from "@/services/constants";
import { simulateContract, waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/chains/config";
import { useState } from "react";

export interface RegisterProps {
  controller: ContractDetails;
  fees: {
    gasPrice: bigint;
    rent: number;
    totalFee: number;
  };
  args: {
    name: string;
    owner: Address;
    duration: number;
    secret: string;
    resolverAddr: Address;
    payment?: Payment;
  };
}

export interface CommitProps {
  controller: ContractDetails;
  hash: string;
}

export interface ApprovalProps {
  controller: ContractDetails;
  payment?: Payment;
  fee: number;
}

export default function useRegister() {
  const { writeContractAsync: commitAsync } = useWriteContract();
  const { writeContractAsync: approveAsync } = useWriteContract();
  const { writeContractAsync: registerAsync } = useWriteContract();

  const [isCommitLoading, setCommitLoading] = useState(false);
  const [isApprovalLoading, setApprovalLoading] = useState(false);
  const [isRegisterLoading, setRegisterLoading] = useState(false);

  const handleCommit = async (props: CommitProps) => {
    const { hash, controller } = props;
    const response: Response = { error: null, isSuccess: false };

    if (hash) {
      try {
        const commitResponse = await commitAsync({
          abi: controller.abi,
          address: controller.address,
          functionName: "commit",
          args: [hash],
        });
        setCommitLoading(true);

        const receipt = await waitForTransactionReceipt(config, {
          hash: commitResponse,
        });

        response.isSuccess = true;
        response.data = {
          hash: commitResponse,
          receipt,
        };
      } catch (error) {
        response.error = error as string;
      }
    }

    setCommitLoading(false);
    return response;
  };

  const handleApproval = async (props: ApprovalProps) => {
    const { controller, payment = PAYMENT_METHOD[0], fee } = props;

    const response: Response = { error: null, isSuccess: false, data: null };

    const spender = controller.address as Address;
    const tokenAddr = payment?.address as Address;

    const value = parseUnits(fee.toString(), payment?.decimals);

    try {
      const token = await simulateContract(config, {
        abi: erc20Abi,
        address: tokenAddr,
        functionName: "approve",
        args: [spender, value],
      });

      const approvalResponse = await approveAsync(token.request);
      setApprovalLoading(true);

      const receipt = await waitForTransactionReceipt(config, {
        hash: approvalResponse,
      });

      response.isSuccess = true;
      response.data = {
        hash: approvalResponse,
        receipt,
      };
    } catch (error) {
      response.error = error as string;
    }

    setApprovalLoading(false);
    return response;
  };

  const handleRegister = async (props: RegisterProps) => {
    const { controller, fees, args } = props;
    const { abi, address } = controller;
    const response: Response = { error: null, isSuccess: false, data: null };

    const payment = args.payment || PAYMENT_METHOD[0];

    try {
      const register = await simulateContract(config, {
        abi,
        address,
        functionName: "registerWithERC20",
        account: args.owner,
        args: [
          args.name,
          args.owner,
          args.duration,
          args.secret,
          args.resolverAddr,
          [],
          false,
          0,
          payment.address,
        ],
      });

      const registerResponse = await registerAsync(register.request);
      setRegisterLoading(true);

      const receipt = await waitForTransactionReceipt(config, {
        hash: registerResponse,
      });

      response.isSuccess = true;
      response.data = {
        hash: registerResponse,
        receipt,
      };
    } catch (error) {
      response.error = error as string;
    }

    setRegisterLoading(false);
    return response;
  };

  return {
    commit: handleCommit,
    approve: handleApproval,
    register: handleRegister,
    isLoading: isCommitLoading || isApprovalLoading || isRegisterLoading,
    isCommitLoading,
    isApprovalLoading,
    isRegisterLoading,
  };
}
