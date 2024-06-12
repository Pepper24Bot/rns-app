import { Domain } from "@/redux/graphql/hooks";
import { NameWithRelation } from "@ensdomains/ensjs/subgraph";
import { Address } from "viem";

export interface TransactionProps {
    activeAddress?: Address;
    domain?: Partial<Domain>;
    owner?: {
        id?: string;
    };

    // New properties for ensjs:getNamesForAddress support
    item: NameWithRelation;
    address: Address;
}

export interface PrimaryProps extends TransactionProps {
    ensName?: string;
    ensAddr?: string;
    refetchEnsName?: () => void;
}

export interface CardProps extends Omit<PrimaryProps, "owner"> {
    item: NameWithRelation;

    /**
     * Active Address:
     * This can be EOA Address or FP Address
    */
    address: Address
}

export interface ExpiryProps extends TransactionProps { }
export interface LinkProps extends TransactionProps { }
export interface DetailsProps extends TransactionProps {
    isSuccess?: boolean
}