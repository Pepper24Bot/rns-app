import { Payment } from "@/redux/domain/domainSlice";
import { Address } from "viem";

export interface ExtendProps {
    /**
     * name to be registered.
     * raw name, without .root
     */
    name: string;

    /**
     * year count, to be converted into seconds
     */
    year: number;
    owner: Address | string;
    isEnabled?: boolean;
    token: Address | string
}

export interface RenewProps {
    name: string;
    duration: number;
    owner?: Address | string;
    token?: Address | string
}

export interface ApprovalProps {
    fee: number;
}