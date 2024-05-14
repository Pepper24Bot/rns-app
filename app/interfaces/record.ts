import { Address } from "viem";

export interface Record {
    name?: string;
    address?: Address;
    key?: string;
    value?: string;
    resolverAddress?: Address;
    owner?: Address;
}

export interface FuturePassRecord extends Record {
    futurePassAddress?: Address;
    nameHash?: Address
}
