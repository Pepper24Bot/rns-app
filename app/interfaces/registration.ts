import { ContractDetails } from "@/hooks/useContractDetails";
import { Address } from "viem";

export interface RegisterProps {
    nameHash?: Address;
    resolver?: ContractDetails;
    args: {
        name: string;
        owner: Address | string;
        duration: number;
        secret: string;
        resolverAddr: Address | string;
        paymentAddress?: Address | string;
        addressRecord?: string;
    };
}

export interface CommitProps {
    /**
     * The hash returned by the makeCommitment function
     */
    hash: string;
}
