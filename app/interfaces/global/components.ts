import { OrderDirection } from "@/redux/graphql/hooks"
import { DropdownType, SortOrder } from "./types"
import { OrderBy } from "@/constants/components";

export interface SortingOption {
    label: string,
    type?: SortOrder,
    orderBy?: OrderBy,
    orderDirection?: OrderDirection
}

export interface Option extends SortingOption {
    icon?: React.ReactNode;

    /** If this is provided, use this as the modal title instead of the label */
    title?: string;
    disabled?: boolean;
}

export interface DropdownProps {
    arrow?: boolean;
    type?: DropdownType;
    isSelected?: boolean;
}

export interface DropDown {
    selectedOption?: Option;
    options: Option[];
    arrow?: boolean;
    type?: DropdownType;
    hasButton?: boolean;
    /** if hasButton is true, this should be provided */
    iconButton?: React.ReactNode;
    handleSelect: (option: Option) => void | any;

    /** if hasButton is true, these are no longer necessary */
    isOpen?: boolean;
    anchorRef?: React.RefObject<HTMLButtonElement>;
    handleClose?: (event: Event | React.SyntheticEvent) => void;
    handleOpen?: () => void;
}
