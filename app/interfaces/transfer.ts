import { Address } from "viem";

export interface TransferProps {
    /**
     * Registered name:
     * e.g legend.root
     */
    name?: string,

    /**
     * The newOwner can be an Address (EOA|FP) and can also be a name
     */
    newOwner?: Address | string,

    /**
     * The caller/sender
     */
    fromOwner?: Address | string,

    /**
     * e.g BigInt(namehash("legend.root"))
     */
    tokenId?: BigInt,

    /**
     * The amount should always be the count of the tokenId
     * For batch transfers, if there are multiple tokens to be transferred,
     * the amount should be the count of the tokenIds.
     * 
     * But for a single transfer, the amount is 1
     */
    amount?: BigInt
}