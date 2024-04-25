import useContractDetails, { ContractDetails } from "./useContractDetails";
import { useWriteContract } from "wagmi";
import {
  Address,
  encodeFunctionData,
  erc20Abi,
  namehash,
  parseUnits,
} from "viem";
import { Response } from "@/services/interfaces";
import { Payment } from "@/redux/domain/domainSlice";
import { PAYMENT_METHOD } from "@/services/constants";
import {
  readContract,
  simulateContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { config } from "@/chains/config";
import { useState } from "react";

export interface RegisterProps {
  controller: ContractDetails;
  resolver?: ContractDetails;
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
    futurePassAddress?: string;
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
  const controller = useContractDetails({ action: "RegistrarController" });
  const { abi, address } = controller;

  const { writeContractAsync } = useWriteContract();

  const [isCommitLoading, setCommitLoading] = useState(false);
  const [isApprovalLoading, setApprovalLoading] = useState(false);
  const [isRegisterLoading, setRegisterLoading] = useState(false);

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

  const handleCommit = async (props: CommitProps) => {
    const { hash } = props;

    let response = { ...initializeResponse() };

    if (hash) {
      try {
        const commitHash = await writeContractAsync({
          abi,
          address,
          functionName: "commit",
          args: [hash],
        });
        setCommitLoading(true);

        response = await waitForTransaction(commitHash);
      } catch (error) {
        response.error = error as string;
      }
    }

    setCommitLoading(false);
    return response;
  };

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

  const handleRegister = async (props: RegisterProps) => {
    const { resolver, args } = props;

    let response = { ...initializeResponse() };

    const payment = args.payment || PAYMENT_METHOD[0];
    const nameHash = namehash(`${args.name}.root`);

    try {
      const addressRecord = encodeFunctionData({
        abi: resolver?.abi || [],
        functionName: "setAddr",
        args: [nameHash, args.owner],
      });

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
          [addressRecord],
          false,
          0,
          payment.address,
        ],
      });

      const hash = await writeContractAsync(register.request);
      setRegisterLoading(true);
      console.log("registration-approval:: ", hash);

      response = await waitForTransaction(hash);
    } catch (error) {
      response.error = error as string;
    }

    console.log("registration-response:: ", response);
    setRegisterLoading(false);
    return response;
  };

  const checkNameValidity = async ({ name = "" }: { name?: string }) => {
    let response = { ...initializeResponse() };

    try {
      const available = await readContract(config, {
        abi,
        address,
        functionName: "available",
        args: [name],
      });

      const valid = await readContract(config, {
        abi,
        address,
        functionName: "valid",
        args: [name],
      });

      response.data = {
        available: available,
        valid: valid,
      };
    } catch (error) {
      response.error = error as string;
    }

    return response;
  };

  return {
    commit: handleCommit,
    approve: handleApproval,
    register: handleRegister,
    isValid: checkNameValidity,
    isLoading: isCommitLoading || isApprovalLoading || isRegisterLoading,
    isCommitLoading,
    isApprovalLoading,
    isRegisterLoading,
  };
}
