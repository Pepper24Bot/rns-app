import { Option } from "@/components/Reusables/DropDownMenu";

export const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000"

export const DEFAULT_DEBOUNCE = 500;

/** https://explorer.rootnet.live/tokens */
export const PAYMENT_METHOD = [
    { label: "ROOT", decimals: 6, address: "0xcCcCCccC00000001000000000000000000000000" },
    { label: "USDC", decimals: 6, address: "0xCCcCCcCC00000C64000000000000000000000000" }
]

export const SORTING_OPTIONS = [
    {
        label: "Name",
        type: "Ascending",
        orderBy: "name",
        orderDirection: "asc"
    },
    {
        label: "Name",
        type: "Descending",
        orderBy: "name",
        orderDirection: "desc"
    },
    // {
    //     label: "Cost",
    //     type: "High",
    //     orderBy: "cost",
    //     orderDirection: "asc"
    // },
    // {
    //     label: "Cost",
    //     type: "Low",
    //     orderBy: "cost",
    //     orderDirection: "desc"
    // },
    {
        label: "Expiry",
        type: "High",
        orderBy: "expiryDate",
        orderDirection: "desc"
    },
    {
        label: "Expiry",
        type: "Low",
        orderBy: "expiryDate",
        orderDirection: "asc"
    },
    // {
    //     label: "Length",
    //     type: "High",
    //     orderBy: "length",
    //     orderDirection: "asc"
    // },
    // {
    //     label: "Length",
    //     type: "Low",
    //     orderBy: "length",
    //     orderDirection: "desc"
    // },
    {
        label: "Created Date",
        type: "Ascending",
        orderBy: "createdAt",
        orderDirection: "asc"
    },
    {
        label: "Created Date",
        type: "Descending",
        orderBy: "createdAt",
        orderDirection: "desc"
    },
]

// day in seconds
export const DAY = 24 * 60 * 60;
export const MIN_REGISTRATION_TIME = 28 * DAY;
// export const COMMITMENT_AGE = 150000;
export const COMMITMENT_AGE = 60000;

// year in seconds
export const SECONDS = 31536000;

// Dashboard Tabs
export const DASHBOARD_TAB_ITEMS = [
    "Identities",
    "FAQ",
    "Favorites",
    "Notifications",
    "LoyaltyPoints",
]