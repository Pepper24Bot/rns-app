import { useReadContract, useReadContracts } from "wagmi";
import { namehash } from "ethers/lib/utils.js";
import { isEmpty } from "lodash";
import { Address, encodeFunctionData } from "viem";
import { SECONDS } from "@/services/constants";
import { BigNumber } from "ethers";
import useContractDetails, { Contract } from "./useContractDetails";
import useEstimateRegistration from "./useEstimateRegistration";

export interface RentPrice {
  base: bigint;
  premium: bigint;
}

export interface RegistrationProps {
  /**
   * this is needed to get which abi and contract address to be used
   */
  action: Contract;

  /**
   * name to be registered.
   * raw name, without .root
   */
  name: string;

  /**
   * year count, to be converted into seconds
   */
  year: number;

  /**
   * TODO: Validate this
   * owner is the wallet address
   */
  owner: Address | undefined;
}

export default function useRegistrationDetails(props: RegistrationProps) {
  const { action, name, year, owner } = props;

  const controller = useContractDetails({ action });
  const resolver = useContractDetails({ action: "Resolver" });

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
