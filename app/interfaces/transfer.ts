import { Address } from "viem";

export interface TransferProps {
    name: string,
    newOwner: Address | string
}