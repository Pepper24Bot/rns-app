import { Domain } from "@/redux/graphql/hooks";
import { Address } from "viem";

export interface TransactionProps {
    activeAddress?: Address;
    domain?: Partial<Domain>;
    owner?: {
        id?: string;
    };
}

export interface PrimaryProps extends TransactionProps {
    ensName?: string;
    ensAddr?: string;
    refetchEnsName?: () => void;
}


export interface LinkProps extends TransactionProps {
    ensName?: string;
}
