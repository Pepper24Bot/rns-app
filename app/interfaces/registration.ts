import { ContractDetails } from "@/hooks/useContractDetails";
import { Address } from "viem";

// TODO: Clean Address | string types here
export interface RegisterProps {
    nameHash?: Address;
    resolver?: ContractDetails;
    fees?: {
        gasPrice?: bigint;
        rent: bigint;
        totalFee?: number;
    };
    args: {
        name: string;
        owner: Address | string;
        duration: number;
        secret: string;
        resolverAddr: Address | string;
        paymentAddress?: Address | string;
        futurePassAddress?: Address | string;
        addressRecord?: string;
    };
}

export interface CommitProps {
    hash: string;
    controller?: ContractDetails;
    fpAccount?: string;
}
