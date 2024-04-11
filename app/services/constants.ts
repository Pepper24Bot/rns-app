export const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000"

export const DEFAULT_DEBOUNCE = 500;

/** https://explorer.rootnet.live/tokens */
export const PAYMENT_METHOD = [
    { label: "ROOT", decimals: 6, address: "0xcCcCCccC00000001000000000000000000000000" },
    { label: "USDC", decimals: 18, address: "0xCCcCCcCC00000C64000000000000000000000000" }
]

export const SORTING_OPTIONS = [
    { label: "Name", type: "Ascending" },
    { label: "Name", type: "Descending" },
    { label: "Cost", type: "High" },
    { label: "Cost", type: "Low" },
    { label: "Expiry", type: "High" },
    { label: "Expiry", type: "Low" },
    { label: "Length", type: "High" },
    { label: "Length", type: "Low" },
    { label: "Created Date", type: "Ascending" },
    { label: "Created Date", type: "Descending" },
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
    "Names",
    "Favorites",
    "Notifications",
    "LoyaltyPoints",
]