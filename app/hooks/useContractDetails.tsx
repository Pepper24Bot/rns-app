import { Address } from "viem";

// Porcini
import * as PorciniEthRegistrarController from "../abis/porcini/ETHRegistrarController.json";
import * as PorciniBaseRegistrar from "../abis/porcini/BaseRegistrarImplementation.json";
import * as PorciniENSRegistry from "../abis/porcini/ENSRegistry.json";
import * as PorciniOwnedResolver from "../abis/porcini/OwnedResolver.json";
import * as PorciniUniversalResolver from "../abis/porcini/UniversalResolver.json";
import * as PorciniReverseRegistrar from "../abis/porcini/ReverseRegistrar.json";
import * as PorciniPublicResolver from "../abis/porcini/PublicResolver.json";
import * as PorciniNameWrapper from "../abis/porcini/NameWrapper.json";

// Root
import * as EthRegistrarController from "../abis/root/ETHRegistrarController.json";
import * as BaseRegistrar from "../abis/root/BaseRegistrarImplementation.json";
import * as ENSRegistry from "../abis/root/ENSRegistry.json";
import * as OwnedResolver from "../abis/root/OwnedResolver.json";
import * as UniversalResolver from "../abis/root/UniversalResolver.json";
import * as ReverseRegistrar from "../abis/root/ReverseRegistrar.json";
import * as PublicResolver from "../abis/root/PublicResolver.json";
import * as NameWrapper from "../abis/root/NameWrapper.json";

import useNetworkConfig from "./useNetworkConfig";

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
  | "ReverseRegistrar"
  | "NameWrapper";

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

export const getMainnetContractAbi = (action: Contract) => {
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
    case "NameWrapper":
      return NameWrapper as ContractDetails;
    case "Registration":
    case "RegistrarController":
    default:
      return EthRegistrarController as ContractDetails;
  }
};

export const getPorciniContractAbi = (action: Contract) => {
  switch (action) {
    case "Transfer":
    case "Base":
      return PorciniBaseRegistrar as ContractDetails;
    case "Link":
    case "ENS":
      return PorciniENSRegistry as ContractDetails;
    case "OwnedResolver":
      return PorciniOwnedResolver as ContractDetails;
    case "UniversalResolver":
      return PorciniUniversalResolver as ContractDetails;
    case "ReverseRegistrar":
      return PorciniReverseRegistrar as ContractDetails;
    case "PublicResolver":
      return PorciniPublicResolver as ContractDetails;
    case "NameWrapper":
      return PorciniNameWrapper as ContractDetails;
    case "Registration":
    case "RegistrarController":
    default:
      return PorciniEthRegistrarController as ContractDetails;
  }
};

export default function useContractDetails(
  props: ContractProps
): ContractDetails {
  const { action } = props;
  const { config } = useNetworkConfig();

  const getContracts = () => {
    if (config.id === 7668) {
      return getMainnetContractAbi(action);
    } else {
      return getPorciniContractAbi(action);
    }
  };

  return { ...getContracts() };
}
