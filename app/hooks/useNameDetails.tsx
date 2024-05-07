import { isEmpty } from "lodash";
import { Address, encodeFunctionData, namehash } from "viem";
import { PAYMENT_METHOD, SECONDS } from "@/constants/components";
import { RentPrice } from "@/services/interfaces";
import { Payment } from "@/redux/domain/domainSlice";
import { useEffect, useState } from "react";
import { readContract, readContracts } from "@wagmi/core";
import { config } from "@/chains/config";

import useContractDetails from "./useContractDetails";

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
    payment = PAYMENT_METHOD[0],
    owner = "0x8F8faa9eBB54DEda91a62B4FC33550B19B9d33bf", // personal-account
    isEnabled,
  } = props;

  const controller = useContractDetails({ action: "RegistrarController" });
  const resolver = useContractDetails({ action: "PublicResolver" });

  const initialRentPrice: RentPrice = {
    base: BigInt(0),
    premium: BigInt(0),
  };

  const [available, setAvailable] = useState<boolean>();
  const [rentPrice, setRentPrice] = useState<RentPrice>(initialRentPrice);
  const [hash, setHash] = useState<string>("");

  const { abi, address } = controller;

  // #1. Get the namehash
  const secret = namehash(name);

  // #2. Get the resolver's address
  const resolverAddr = resolver.address;

  // Default token = ROOT
  const token = payment?.address || PAYMENT_METHOD[0].address;

  const duration = year * SECONDS;
  const contract = {
    abi,
    address,
  };

  /**
   * #3. Get the availability of the name - if not available, do not make a commitment
   * #4. Get the rent price based on the name and duration
   */
  const getPriceAndAvailability = async () => {
    const data = await readContracts(config, {
      contracts: [
        { ...contract, functionName: "available", args: [name] },
        {
          ...contract,
          functionName: "rentERC20Price",
          args: [token, name, duration],
        },
      ],
    });

    const [availability, rentPrice] = data || [];

    setAvailable(Boolean(availability?.result));
    setRentPrice(rentPrice.result as unknown as RentPrice);
  };

  /**
   * #5. Add Address Record - By default, linked the name to the owner
   * #6. Make a commitment
   */
  const makeCommitment = async () => {
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

    const data = await readContract(config, {
      abi,
      address,
      functionName: "makeCommitment",
      args: commitmentArgs,
    });

    setHash(String(data));
  };

  /**
   * Note: Enable this when needed
   * #7. Get the estimated gas fee to be used in Transaction Fee field
   */
  const getEstimatedGas = () => {
    // const encodedFunction = encodeFunctionData({
    //   abi,
    //   functionName: "registerWithERC20",
    //   args: [...commitmentArgs, token],
    // });
    // const { estimatedGas, gasPrice } = useEstimateRegistration({
    //   encodedFunction,
    //   owner,
    // });
  };

  useEffect(() => {
    if (!isEmpty(name) && isEnabled) {
      getPriceAndAvailability();
    }
  }, [name, isEnabled, duration, payment?.address]);

  useEffect(() => {
    if (isEnabled && available) {
      makeCommitment();
    }
  }, [available, name, isEnabled]);

  const rentFee = rentPrice
    ? (rentPrice as unknown as RentPrice)
    : initialRentPrice;

  return {
    availability: available,
    rentPrice: rentFee,
    controller,
    resolver,
    resolverAddr,
    duration,
    secret,
    hash,
  };
}
