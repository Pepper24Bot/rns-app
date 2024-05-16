import { Address } from "viem";

export interface ExtendProps {
    /**
     * name to extend.
     * raw name, without .root
     */
    name: string;

    /**
     * year count, to be converted into seconds
     */
    year: number;
    owner?: Address | string;
    isEnabled?: boolean;
    token: Address | string;
}

export interface RenewProps extends Partial<ExtendProps> {
    duration: number;
}
