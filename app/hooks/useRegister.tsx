import { COMMITMENT_AGE } from "@/services/constants";
import { ContractDetails } from "./useContractDetails";
import { config } from "@/chains/config";
import { useWriteContract } from "wagmi";
import { simulateContract } from "viem/actions";
import { Address, Client } from "viem";
import { Response } from "@/services/interfaces";

export interface RegisterProps {
  name: string;
  duration: number;
  nameHash: string;
  resolverAddr: string;
  address: Address;
  controller: ContractDetails;
}

export interface CommitProps {
  controller: ContractDetails;
  hash: string;
}

export default function useRegister() {
  const { writeContractAsync, isPending, isSuccess } = useWriteContract();

  const handleCommit = async (props: CommitProps) => {
    const { hash, controller } = props;
    const response: Response = { error: null, isSuccess: false };

    if (hash) {
      try {
        await writeContractAsync({
          abi: controller.abi,
          address: controller.address,
          functionName: "commit",
          args: [hash],
        });

        console.log("response:: ", response);
        response.isSuccess = true;
      } catch (error) {
        response.error = error as string;
      }
    }

    return response;
  };

  const handleRegister = async (props: RegisterProps) => {
    const { controller, name, address, duration, nameHash, resolverAddr } =
      props;

    if (!isPending && isSuccess) {
      // TODO: useWaitForTransaction
      setTimeout(() => {
        console.log("waiting for commitment age...");
      }, COMMITMENT_AGE);

      /**
       * prepare the transaction using simulateContract
       * wagmi v2: https://wagmi.sh/react/guides/migrate-from-v1-to-v2#removed-prepare-hooks
       */
      const registerConfig = await simulateContract(
        config as unknown as Client,
        {
          abi: controller.abi,
          address: controller.address,
          functionName: "register",
          args: [
            name,
            address as Address,
            duration,
            nameHash,
            resolverAddr,
            [],
            false,
            0,
          ],
        }
      );

      const registerResponse = await writeContractAsync(
        registerConfig!.request
      );

      console.log("config:: ", registerConfig);
      console.log("response:: ", registerResponse);
    }
  };

  return {
    commit: handleCommit,
    register: handleRegister,
  };
}
