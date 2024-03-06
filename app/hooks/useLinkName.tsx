import { useReadContract, useWriteContract } from "wagmi";
import { Address, namehash } from "viem";
import { Response } from "@/services/interfaces";
import { isEmpty } from "lodash";
import useContractDetails from "./useContractDetails";

export interface LinkName {
  name: string;
  address?: Address;
}

// sample name
// [figjam.eth] 0xaDf27DD9c31AB734f06bB5bD2D6B04Eb10E4B5d5

export default function useLinkName(props: LinkName) {
  const { name } = props;

  const controller = useContractDetails({ action: "ENS" });
  const { writeContractAsync, isPending, isSuccess } = useWriteContract();

  const { abi, address } = controller;
  const hashedName = namehash(name);

  const { data: owner } = useReadContract({
    abi,
    address,
    functionName: "owner",
    args: [hashedName],
    query: { enabled: !isEmpty(hashedName) },
  });

  const { data: resolver } = useReadContract({
    abi,
    address,
    functionName: "resolver",
    args: [hashedName],
    query: { enabled: !isEmpty(hashedName) },
  });

  console.log(`
  current-owner:: ${owner}
  resolver:: ${resolver}
  `);

  const handleLinkname = async (props: LinkName) => {
    const { address } = props;
    const response: Response = { error: null, isSuccess: false };

    if (hashedName && address) {
      try {
        await writeContractAsync({
          abi,
          address,
          functionName: "setOwner",
          args: [hashedName, address],
        });

        console.log("response:: ", response);
        response.isSuccess = true;
      } catch (error) {
        console.log("error:: ", error);
        response.error = error as string;
      }
    }

    return response;
  };

  return {
    setOwner: handleLinkname,
    owner,
    resolver,
    // TODO: Check if this will update even if the custom hook is loaded before completing the writeContract
    isSuccess,
  };
}
