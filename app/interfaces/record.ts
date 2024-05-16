import { Address } from "viem";

export interface RecordProps {
    name?: string;
    nameHash?: Address
    address?: Address;
    key?: string;
    value?: string;
    resolverAddress?: Address;
}
