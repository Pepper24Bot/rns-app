import { Address } from "viem";

export interface PrimaryName {
    name?: string;
    address?: Address;
    domainId?: string;
    resolverAddress?: Address;
    addressRecord?: Address;
}
