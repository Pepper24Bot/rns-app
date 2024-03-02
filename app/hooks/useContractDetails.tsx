import { Address } from "viem";

import * as EthRegistrarController from "../abis/porcini/ETHRegistrarController.json";
import * as BaseRegistrar from "../abis/porcini/BaseRegistrarImplementation.json";
import * as ENSRegistry from "../abis/porcini/ENSRegistry.json";
import * as OwnedResolver from "../abis/porcini/OwnedResolver.json";

export type Contract =
  | "Registration"
  | "RegistrarController"
  | "Extend"
  | "Link"
  | "Transfer"
  | "Resolver"
  | "ENS"
  | "Base";

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
    case "Resolver":
      return OwnedResolver as ContractDetails;
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
