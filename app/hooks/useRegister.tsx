import { useWriteContract } from "wagmi";
import { Address, encodeFunctionData, namehash } from "viem";
import { ErrorResponse } from "@/services/interfaces";
import { readContract } from "@wagmi/core";
import { config } from "@/chains/config";
import { useState } from "react";
import { initializeResponse, isCommitmentValid } from "@/utils/common";
import { formatDistanceToNowStrict } from "date-fns";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { CommitProps, RegisterProps } from "@/interfaces/registration";

import useContractDetails from "./useContractDetails";
import useProxyRegister from "./FuturePass/useProxyRegister";
import useWaitTransaction from "./useWaitTransaction";

export default function useRegister() {
  const controller = useContractDetails({ action: "RegistrarController" });

  const { abi, address } = controller;
  const { writeContractAsync } = useWriteContract();
  const { waitForWriteTransaction } = useWaitTransaction();
  const { useRootNetwork } = useRootNetworkState();
  const { data: root } = useRootNetwork();
  const { registerProxyCall, commitProxyCall } = useProxyRegister({
    registrarController: controller,
  });

  const [isCommitLoading, setCommitLoading] = useState(false);
  const [isRegisterLoading, setRegisterLoading] = useState(false);

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

    console.log("Commitments-Response:: ", response);
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
        let commitHash = "0x" as Address;

        if (root.isFpActive) {
          commitHash = await commitProxyCall({ hash });
        } else {
          commitHash = await writeContractAsync({
            abi,
            address,
            functionName: "commit",
            args: [hash],
          });
        }

        setCommitLoading(true);
        response = await waitForWriteTransaction(commitHash);
      } catch (e) {
        const error = e as ErrorResponse;
        response.error = error;
      }
    }

    console.log("Commit-Response:: ", response);
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
    const { name, owner, duration, secret, resolverAddr, paymentAddress } =
      args;

    let response = { ...initializeResponse() };

    try {
      let registerHash = "0x" as Address;

      const nameHash = namehash(`${args.name}.root`);
      const addressRecord = encodeFunctionData({
        abi: resolver?.abi || [],
        functionName: "setAddr",
        args: [nameHash, root.address],
      });

      if (root.isFpActive) {
        registerHash = (await registerProxyCall({
          args: {
            name,
            owner: root.address ?? "",
            duration,
            secret,
            resolverAddr,
            paymentAddress,
            addressRecord,
          },
        })) as Address;
      } else {
        registerHash = await writeContractAsync({
          abi,
          address,
          functionName: "registerWithERC20",
          account: args.owner as Address,
          args: [
            name,
            owner,
            duration,
            secret,
            resolverAddr,
            [addressRecord],
            false,
            0,
            paymentAddress ?? "",
          ],
        });
      }

      setRegisterLoading(true);
      response = await waitForWriteTransaction(registerHash);
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
