import { Config, useReadContract, useWriteContract } from "wagmi";
import { formatUnits, namehash } from "ethers/lib/utils.js";
import { isEmpty } from "lodash";
import { COMMITMENT_AGE, MIN_REGISTRATION_TIME } from "@/services/constants";
import { Address } from "viem";
import { WriteContractMutate } from "wagmi/query";
import useContractDetails, {
  Contract,
  ContractDetails,
} from "./useContractDetails";

export interface RegisterProps {
  name: string;
  owner: string;
  duration: number;
  nameHash: string;
  resolverAddr: string;
  isAvailable: boolean;
}

export const register = (
  hash: Address,
  writeContract: WriteContractMutate<Config, unknown>,
  isSuccess: Boolean,
  controller: ContractDetails,
  props: RegisterProps
) => {
  const { name, owner, duration, nameHash, resolverAddr } = props;

  if (hash) {
    writeContract({
      abi: controller.abi,
      address: controller.address,
      functionName: "commit",
      args: [hash],
    });

    setTimeout(() => {
      console.log("waiting for commitment age...");
    }, COMMITMENT_AGE);

    // if commit is success then proceed to registration
    if (isSuccess) {
      writeContract({
        abi: controller.abi,
        address: controller.address,
        functionName: "register",
        args: [name, owner, duration, nameHash, resolverAddr, [], false, 0],
      });
    }
  }
};

export default function useRegister(props: RegisterProps) {
  const { name, owner, duration, nameHash, resolverAddr, isAvailable } = props;

  const controller = useContractDetails({ action: "RegistrarController" });
  const { writeContract, isPending, isSuccess } = useWriteContract();

  const shouldMakeACommitment =
    !isEmpty(name) &&
    isAvailable &&
    duration >= MIN_REGISTRATION_TIME &&
    !isEmpty(nameHash) &&
    !isEmpty(resolverAddr);

  const { data: commitment } = useReadContract({
    abi: controller.abi,
    address: controller.address,
    functionName: "makeCommitment",
    args: [name, owner, duration, nameHash, resolverAddr, [], false, 0],
    query: { enabled: shouldMakeACommitment },
  });

  const hash = commitment as unknown as Address;

  return {
    hash,
    // register: register(hash, writeContract, isSuccess, controller, props),
    isPending,
    isSuccess,
  };
}
