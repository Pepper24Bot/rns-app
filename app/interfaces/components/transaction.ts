import { Domain } from "@/redux/graphql/hooks";
import { Address } from "viem";

export interface TransactionProps {
    domain?: Partial<Domain>;
    owner?: {
        id?: string;
    };
}

export interface PrimaryProps extends TransactionProps {
    activeAddress?: Address;
    ensName?: string;
    ensAddr?: string;
    refetchEnsName?: () => void;
}


export interface LinkProps extends TransactionProps {
    ensName?: string;
    activeAddress?: Address;
}
