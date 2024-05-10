import useContractDetails, { ContractDetails } from "./useContractDetails";
import { useWriteContract } from "wagmi";
import { Address, encodeFunctionData, namehash } from "viem";
import { ErrorResponse, Response } from "@/services/interfaces";
import { Payment } from "@/redux/domain/domainSlice";
import { PAYMENT_METHOD } from "@/constants/components";
import {
  readContract,
  simulateContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { config } from "@/chains/config";
import { useState } from "react";
import { isCommitmentValid } from "@/utils/common";
import { formatDistanceToNowStrict } from "date-fns";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";

import useFpRegister from "./FuturePass/useFpRegister";

export interface RegisterProps {
  controller: ContractDetails;
  resolver?: ContractDetails;
  fees?: {
    gasPrice?: bigint;
    rent: bigint;
    totalFee?: number;
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
  controller?: ContractDetails;
  hash: string;
}

export default function useRegister() {
  const { useRootNetwork } = useRootNetworkState();
  const { data: root } = useRootNetwork();

  const controller = useContractDetails({ action: "RegistrarController" });
  const { abi, address } = controller;

  const { writeContractAsync } = useWriteContract();
  const { registerProxyCall, commitProxyCall } = useFpRegister();

  const [isCommitLoading, setCommitLoading] = useState(false);
  const [isRegisterLoading, setRegisterLoading] = useState(false);

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

  const getCommitments = async (props: CommitProps) => {
    const { hash } = props;

    let response = { ...initializeResponse() };

    if (hash) {
      try {
        const commitments = await readContract(config, {
          abi,
          address,
          functionName: "commitments",
          args: [hash],
        });
        setCommitLoading(true);

        const distance =
          Number(commitments) === 0
            ? "0 minutes"
            : formatDistanceToNowStrict(Number(commitments) * 1000, {
                unit: "minute",
              });

        response.isSuccess = true;
        response.data = {
          commitment: Number(commitments),
          age: distance,
          isCommitmentValid: isCommitmentValid(distance),
        };
      } catch (e) {
        const error = e as ErrorResponse;
        response.error = error;
      }
    }

    console.log("commitments-response:: ", response);
    setCommitLoading(false);
    return response;
  };

  /**
   *
   * @param props
   * @returns
   */
  const handleCommit = async (props: CommitProps) => {
    const { hash } = props;

    let response = { ...initializeResponse() };

    if (hash) {
      try {
        if (root.isFpActive) {
          const commitHash = await commitProxyCall({
            hash,
            fpAccount: root.futurePassAddress,
          });
          setCommitLoading(true);
          console.log("commitmentHash:: ", commitHash);

          return {
            isSuccess: true,
            error: null,
            data: {
              hash: commitHash,
            },
          };
        } else {
          const commitHash = await writeContractAsync({
            abi,
            address,
            functionName: "commit",
            args: [hash],
          });
          setCommitLoading(true);

          response = await waitForTransaction(commitHash);
        }
      } catch (e) {
        const error = e as ErrorResponse;
        response.error = error;
      }
    }

    console.log("commit-response:: ", response);
    setCommitLoading(false);
    return response;
  };

  /**
   *
   * @param props
   * @returns
   */
  const handleRegister = async (props: RegisterProps) => {
    const { resolver, args } = props;

    let response = { ...initializeResponse() };

    const payment = args.payment || PAYMENT_METHOD[0];
    const nameHash = namehash(`${args.name}.root`);

    const addressRecord = encodeFunctionData({
      abi: resolver?.abi || [],
      functionName: "setAddr",
      args: [nameHash, root.address],
    });

    try {
      if (root.isFpActive) {
        const registerHash = (await registerProxyCall({
          args: {
            name: args.name,
            owner: root.address as Address,
            duration: args.duration,
            secret: args.secret,
            resolverAddr: args.resolverAddr,
            paymentAddress: payment.address as Address,
            addressRecord,
            futurePassAddress: root.futurePassAddress as Address,
          },
        })) as Address;
        setRegisterLoading(true);
        // response = await waitForTransaction(commitHash)

        console.log("registerHash:: ", registerHash);
        console.log("-----------------");

        return {
          isSuccess: true,
          error: null,
          data: {
            hash: registerHash,
          },
        };
      } else {
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

        response = await waitForTransaction(hash);
      }
    } catch (e) {
      const error = e as ErrorResponse;
      response.error = error;
    }

    console.log("registration-response:: ", response);
    setRegisterLoading(false);
    return response;
  };

  return {
    commit: handleCommit,
    register: handleRegister,
    commitments: getCommitments,
    isLoading: isCommitLoading || isRegisterLoading,
    isCommitLoading,
    isRegisterLoading,
  };
}
