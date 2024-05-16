import { ContractDetails } from "@/hooks/useContractDetails";
import { Payment } from "@/redux/domain/domainSlice";
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

export interface MakeCommitProps {
    /**
     * name to be registered.
     * raw name, without .root
     */
    name: string;

    /**
     * year count, to be converted into seconds
     */
    year: number;

    /**
     * Payment Address:
     * ROOT = 0xcCcCCccC00000001000000000000000000000000
     * USDC = 0xCCcCCcCC00000C64000000000000000000000000
     */
    token: Address;

    isEnabled?: boolean;
}
