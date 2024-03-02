import { useGasPrice, useReadContract, useWriteContract } from "wagmi";
import { formatUnits, namehash } from "ethers/lib/utils.js";
import { isEmpty } from "lodash";
import { Address } from "viem";
import { SECONDS, MIN_REGISTRATION_TIME } from "@/services/constants";
import { porcini } from "@/chains/porcini";
import { BigNumber } from "ethers";
import useContractDetails, { Contract } from "./useContractDetails";

export interface RentPrice {
  base: BigNumber;
  premium: BigNumber;
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
  console.log("----------");
  const { action, name, year } = props;

  const controller = useContractDetails({ action });
  const resolver = useContractDetails({ action: "Resolver" });

  const { data: gasFee } = useGasPrice({ chainId: porcini.id });

  const duration = year * SECONDS;

  const shouldGetAvailability = !isEmpty(name);

  // #1. Check for the name's availability
  const { data: availability, isLoading: availabilityLoading } =
    useReadContract({
      abi: controller.abi,
      address: controller.address,
      functionName: "available",
      args: [name],
      query: { enabled: shouldGetAvailability },
    });

  // #2. Get the name's rent price
  const shouldGetRentPrice =
    !isEmpty(name) &&
    availability &&
    duration >= MIN_REGISTRATION_TIME &&
    !availabilityLoading;

  const { data: rentPrice } = useReadContract({
    abi: controller.abi,
    address: controller.address,
    functionName: "rentPrice",
    args: [name, duration],
    query: { enabled: shouldGetRentPrice },
  });

  // #3. Get the namehash
  const nameHash = namehash(name);

  // #4. Get the resolver's address
  const resolverAddr = resolver.address;

  console.log("gas fee:: ", gasFee && formatUnits(gasFee, 18));

  return {
    controller,
    resolver,
    availability,
    duration,
    rentPrice: rentPrice as unknown as RentPrice,
    nameHash,
    resolverAddr,
  };
}
