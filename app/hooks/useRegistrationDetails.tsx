import { useReadContract, useReadContracts } from "wagmi";
import { namehash } from "ethers/lib/utils.js";
import { isEmpty } from "lodash";
import { Address, encodeFunctionData } from "viem";
import { SECONDS } from "@/services/constants";
import useContractDetails from "./useContractDetails";
import useEstimateRegistration from "./useEstimateRegistration";
import { RentPrice } from "@/services/interfaces";

export interface RegistrationProps {
  /**
   * name to be registered.
   * raw name, without .root
   */
  name: string;

  /**
   * year count, to be converted into seconds
   */
  year: number;

  owner: Address | undefined;
}

export default function useRegistrationDetails(props: RegistrationProps) {
  const {
    name,
    year,
    owner = "0x8F8faa9eBB54DEda91a62B4FC33550B19B9d33bf", // personal-account - dummy
  } = props;

  const controller = useContractDetails({ action: "RegistrarController" });
  const resolver = useContractDetails({ action: "OwnedResolver" });

  const { abi, address } = controller;

  const duration = year * SECONDS;
  const contract = {
    abi,
    address,
  };

  const { data, isSuccess, isPending } = useReadContracts({
    query: { enabled: !isEmpty(name) },
    contracts: [
      // #1. Get the availability of the name
      { ...contract, functionName: "available", args: [name] },
      // #2. Get the rent price based on the name and duration
      {
        ...contract,
        functionName: "rentPrice",
        args: [name, duration],
      },
    ],
  });

  const [availability, rentPrice] = data || [];

  // #3. Get the namehash
  const nameHash = namehash(name);

  // #4. Get the resolver's address
  const resolverAddr = resolver.address;

  // #5. Make a commitment
  const shouldMakeACommitment =
    owner && !isEmpty(name) && availability?.result && !isPending && isSuccess;

  const commitmentArgs = [
    name,
    owner as Address,
    duration,
    nameHash,
    resolverAddr,
    [],
    false,
    0,
  ];

  const { data: commitment } = useReadContract({
    abi,
    address,
    functionName: "makeCommitment",
    args: commitmentArgs,
    query: { enabled: shouldMakeACommitment },
  });

  // #6. Get the estimated gas fee to be used in Transaction Fee field
  const encodedFunction = encodeFunctionData({
    abi,
    functionName: "register",
    args: commitmentArgs,
  });

  const { estimatedGas, gasPrice } = useEstimateRegistration({
    encodedFunction,
    owner,
  });

  const fallBackRent: RentPrice = {
    base: BigInt(0),
    premium: BigInt(0),
  };

  const rentFee = rentPrice?.result
    ? (rentPrice?.result as unknown as RentPrice)
    : fallBackRent;

  return {
    availability: availability?.result,
    estimatedGas,
    estimatedGasPrice: gasPrice,
    rentPrice: rentFee,
    controller,
    resolver,
    resolverAddr,
    duration,
    nameHash,
    hash: commitment,
    args: commitmentArgs,
  };
}
