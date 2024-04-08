import { ContractDetails } from "./useContractDetails";
import { useWriteContract } from "wagmi";
import { Address, parseUnits } from "viem";
import { Response } from "@/services/interfaces";
import { Payment } from "@/redux/domain/domainSlice";
import { PAYMENT_METHOD } from "@/services/constants";

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
    nameHash: string;
    resolverAddr: string;
    payment?: Payment;
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
    const { controller, fees, args } = props;
    const { abi, address } = controller;
    const response: Response = { error: null, isSuccess: false, data: null };
    console.log("entering registration hook...");

    const payment = args.payment || PAYMENT_METHOD[0];

    // TODO: Figure this out, is this correct
    const value = parseUnits(fees.totalFee.toString(), payment.decimals);
    console.log("value:: ", value);

    try {
      const registerResponse = await registerAsync({
        abi,
        address,
        // functionName: "register",
        // value: parseEther(fees.totalFee),
        functionName: "registerWithERC20",
        account: args.owner,
        value,
        args: [
          args.name,
          args.owner,
          args.duration,
          args.nameHash,
          args.resolverAddr,
          [],
          false,
          0,
          payment.address,
        ],
      });
      response.isSuccess = true;
      response.data = registerResponse;
    } catch (error) {
      response.error = error as string;
    }

    console.log("response:: ", response);
    return response;
  };

  return {
    commit: handleCommit,
    register: handleRegister,
  };
}
