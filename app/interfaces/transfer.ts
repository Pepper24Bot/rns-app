import { Address } from "viem";

export interface TransferProps {
    name?: string,
    newOwner?: Address | string,
    fromOwner?: Address | string,
    tokenId?: BigInt,
    amount?: BigInt
}