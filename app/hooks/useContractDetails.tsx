import { Address } from "viem";

import * as EthRegistrarController from "../abis/porcini/ETHRegistrarController.json";
import * as BaseRegistrar from "../abis/porcini/BaseRegistrarImplementation.json";
import * as ENSRegistry from "../abis/porcini/ENSRegistry.json";
import * as OwnedResolver from "../abis/porcini/OwnedResolver.json";
import * as UniversalResolver from "../abis/porcini/UniversalResolver.json";
import * as ReverseRegistrar from "../abis/porcini/ReverseRegistrar.json";
import * as PublicResolver from "../abis/porcini/PublicResolver.json";

export type Contract =
  | "Registration"
  | "RegistrarController"
  | "Extend"
  | "Link"
  | "Transfer"
  | "OwnedResolver"
  | "ENS"
  | "Base"
  | "UniversalResolver"
  | "PublicResolver"
  | "ReverseRegistrar";

export interface ContractProps {
  action: Contract;
}

export interface ContractDetails {
  address: Address;
  abi: any[];
  transactionHash: Address;
  receipt: any;
  args: any[];
}

export const getContractAbi = (action: Contract) => {
  switch (action) {
    case "Transfer":
    case "Base":
      return BaseRegistrar as ContractDetails;
    case "Link":
    case "ENS":
      return ENSRegistry as ContractDetails;
    case "OwnedResolver":
      return OwnedResolver as ContractDetails;
    case "UniversalResolver":
      return UniversalResolver as ContractDetails;
    case "ReverseRegistrar":
      return ReverseRegistrar as ContractDetails;
    case "PublicResolver":
      return PublicResolver as ContractDetails;
    case "Registration":
    case "RegistrarController":
    default:
      return EthRegistrarController as ContractDetails;
  }
};

export default function useContractDetails(
  props: ContractProps
): ContractDetails {
  const { action } = props;

  return { ...getContractAbi(action) };
}
