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
import { useSnackbar } from "notistack";

import useContractDetails from "./useContractDetails";
import useProxyRegister from "./FuturePass/useProxyRegister";
import useWaitTransaction from "./useWaitTransaction";
import useExtrinsicRegister from "./FuturePass/ProxyExtrinsic/useExtrinsicRegister";

export default function useRegister() {
  const controller = useContractDetails({ action: "RegistrarController" });
  const ensRegistry = useContractDetails({ action: "ENSRegistry" });

  const { enqueueSnackbar } = useSnackbar();
  const { abi, address: controllerAddr } = controller;
  const { writeContractAsync } = useWriteContract();
  const { waitForWriteTransaction } = useWaitTransaction();
  const { useRootNetwork } = useRootNetworkState();
  const {
    data: { isFpActive, address },
  } = useRootNetwork();
  const { registerProxyCall, commitProxyCall } = useProxyRegister({
    registrarController: controller,
  });

  const { registerExtrinsic, commitExtrinsic } = useExtrinsicRegister();

  const [isCommitLoading, setCommitLoading] = useState(false);
  const [isRegisterLoading, setRegisterLoading] = useState(false);

  const getCommitments = async (props: CommitProps) => {
    const { hash } = props;

    let response = { ...initializeResponse() };

    if (hash) {
      try {
        const commitments = await readContract(config, {
          abi,
          address: controllerAddr,
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
        enqueueSnackbar(error.shortMessage, { variant: "error" });
      }
    }

    console.log("Commitments-Response:: ", response);
    setCommitLoading(false);
    return response;
  };

  const getRecord = async (name: string) => {
    const hash = namehash(name);
    const tokenId = BigInt(hash);

    console.log("tokenId:: ", tokenId);
    console.log("hash:: ", hash);

    let response = { ...initializeResponse() };

    if (hash) {
      try {
        const record = await readContract(config, {
          abi: ensRegistry.abi,
          address: ensRegistry.address,
          functionName: "recordExists",
          args: [hash],
        });
        response.data = record;
        console.log("records-response:: ", record);
      } catch (e) {
        const error = e as ErrorResponse;
        response.error = error;
        enqueueSnackbar(error.shortMessage, { variant: "error" });
      }
    }

    console.log("Records-Response:: ", response);
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

        if (isFpActive) {
          // commitHash = (await commitProxyCall({ hash })) as Address;
          setCommitLoading(true);
          commitHash = (await commitExtrinsic({ hash })) as Address;
          response = {
            isSuccess: true,
            error: null,
            data: {
              hash: commitHash,
              receipt: hash,
            },
          };
        } else {
          commitHash = await writeContractAsync({
            abi,
            address: controllerAddr,
            functionName: "commit",
            args: [hash],
          });

          setCommitLoading(true);
          response = await waitForWriteTransaction(commitHash);
        }

        enqueueSnackbar("Request to register is in progress.", {
          variant: "info",
        });
      } catch (e) {
        const error = e as ErrorResponse;
        response.error = error;
        const message = error.shortMessage || error.message;
        enqueueSnackbar(message, { variant: "error" });
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
    const {
      name,
      owner,
      duration,
      secret,
      resolverAddr,
      paymentAddress,
      isPrimary,
    } = args;

    let response = { ...initializeResponse() };

    try {
      let registerHash = "0x" as Address;

      const nameHash = namehash(`${args.name}.root`);
      const addressRecord = encodeFunctionData({
        abi: resolver?.abi || [],
        functionName: "setAddr",
        args: [nameHash, address],
      });

      if (isFpActive) {
        // registerHash = (await registerProxyCall({
        //   args: {
        //     name,
        //     owner: address ?? "",
        //     duration,
        //     secret,
        //     resolverAddr,
        //     paymentAddress,
        //     addressRecord,
        //     isPrimary: isPrimary || false,
        //   },
        // })) as Address;
        setRegisterLoading(true);
        registerHash = (await registerExtrinsic({
          args: {
            name,
            owner: address ?? "",
            duration,
            secret,
            resolverAddr,
            paymentAddress,
            addressRecord,
            isPrimary: isPrimary || false,
          },
        })) as Address;
        response = {
          isSuccess: true,
          error: null,
          data: {
            hash: registerHash,
            receipt: registerHash,
          },
        };
      } else {
        registerHash = await writeContractAsync({
          abi,
          address: controllerAddr,
          functionName: "registerWithERC20",
          account: args.owner as Address,
          args: [
            name,
            owner,
            duration,
            secret,
            resolverAddr,
            [addressRecord],
            isPrimary || false,
            0,
            paymentAddress ?? "",
          ],
        });

        setRegisterLoading(true);
        response = await waitForWriteTransaction(registerHash);
      }

      enqueueSnackbar("Registration is in progress. Please, do not close.", {
        variant: "info",
      });
    } catch (e) {
      const error = e as ErrorResponse;
      response.error = error;
      const message = error.shortMessage || error.message;
      enqueueSnackbar(message, { variant: "error" });
    }

    console.log("registration-response:: ", response);
    setRegisterLoading(false);
    return response;
  };

  return {
    commit: handleCommit,
    register: handleRegister,
    commitments: getCommitments,
    records: getRecord,
    isLoading: isCommitLoading || isRegisterLoading,
    isCommitLoading,
    isRegisterLoading,
  };
}
