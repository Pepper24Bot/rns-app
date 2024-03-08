import { COMMITMENT_AGE } from "@/services/constants";
import { ContractDetails } from "./useContractDetails";
import { useWriteContract } from "wagmi";
import { Address, parseEther } from "viem";
import { Response } from "@/services/interfaces";

export interface RegisterProps {
  controller: ContractDetails;
  fees: {
    gasPrice: bigint;
    rent: string;
  };
  args: {
    name: string;
    owner: Address;
    duration: number;
    nameHash: string;
    resolverAddr: string;
  };
}

export interface CommitProps {
  controller: ContractDetails;
  hash: string;
}

export default function useRegister() {
  const { writeContractAsync: commitAsync } = useWriteContract();
  const { writeContractAsync: registerAsync } = useWriteContract();

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

        response.isSuccess = true;
        response.data = commitResponse;
      } catch (error) {
        response.error = error as string;
      }
    }
    return response;
  };

  const handleRegister = async (props: RegisterProps) => {
    console.log("-----entering registration-----");
    const { controller, fees, args } = props;
    const { abi, address } = controller;
    const response: Response = { error: null, isSuccess: false, data: null };

    try {
      const registerResponse = await registerAsync({
        abi,
        address,
        functionName: "register",
        account: args.owner,
        value: parseEther(fees.rent),
        args: [
          args.name,
          args.owner,
          args.duration,
          args.nameHash,
          args.resolverAddr,
          [],
          false,
          0,
        ],
      });
      response.isSuccess = true;
      response.data = registerResponse;
    } catch (error) {
      response.error = error as string;
    }

    return response;
  };

  return {
    commit: handleCommit,
    register: handleRegister,
  };
}
