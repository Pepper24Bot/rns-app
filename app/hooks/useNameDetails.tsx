import { useReadContract, useReadContracts } from "wagmi";
import { isEmpty } from "lodash";
import { Address, encodeFunctionData, namehash } from "viem";
import { PAYMENT_METHOD, SECONDS } from "@/services/constants";
import { RentPrice } from "@/services/interfaces";
import { Payment } from "@/redux/domain/domainSlice";

import useContractDetails from "./useContractDetails";
import useEstimateRegistration from "./useEstimateRegistration";

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

  payment?: Payment;

  isEnabled?: boolean;

  futurePassAddress?: string;
}

/** TODO: Optimize this hook */
export default function useNameDetails(props: RegistrationProps) {
  const {
    name,
    year,
    payment,
    owner = "0x8F8faa9eBB54DEda91a62B4FC33550B19B9d33bf", // personal-account
    isEnabled,
    futurePassAddress,
  } = props;

  const controller = useContractDetails({ action: "RegistrarController" });
  const resolver = useContractDetails({ action: "PublicResolver" });
  const { abi, address } = controller;

  // Default token = ROOT
  const token = payment?.address || PAYMENT_METHOD[0].address;

  const duration = year * SECONDS;
  const contract = {
    abi,
    address,
  };

  const { data, isSuccess, isPending } = useReadContracts({
    query: { enabled: !isEmpty(name) && isEnabled },
    contracts: [
      // #1. Get the availability of the name
      { ...contract, functionName: "available", args: [name] },
      // #2. Get the rent price based on the name and duration
      {
        ...contract,
        // functionName: "rentPrice",
        functionName: "rentERC20Price",
        args: [token, name, duration],
      },
    ],
  });

  const [availability, rentPrice] = data || [];

  // #3. Get the namehash
  const secret = namehash(name);

  // #4. Get the resolver's address
  const resolverAddr = resolver.address;

  // #5. Make a commitment
  const shouldMakeACommitment =
    owner && !isEmpty(name) && availability?.result && !isPending && isSuccess;

  // #6. Add Address Record
  const nameHash = namehash(`${name}.root`);
  const addressRecord = encodeFunctionData({
    abi: resolver.abi,
    functionName: "setAddr",
    args: [nameHash, owner],
  });

  const commitmentArgs = [
    name,
    owner as Address,
    duration,
    secret,
    resolverAddr,
    [addressRecord],
    false,
    0,
  ];

  const { data: commitment } = useReadContract({
    abi,
    address,
    functionName: "makeCommitment",
    args: commitmentArgs,
    query: { enabled: shouldMakeACommitment && isEnabled },
  });

  // #7. Get the estimated gas fee to be used in Transaction Fee field
  const encodedFunction = encodeFunctionData({
    abi,
    functionName: "registerWithERC20",
    args: [...commitmentArgs, token],
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
    secret,
    hash: commitment,
    args: commitmentArgs,
  };
}
