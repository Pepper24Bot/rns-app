export const DEFAULT_DEBOUNCE = 500;

export const PAYMENT_METHOD = [
    { label: "ROOT" },
    // { label: "USDC" }
]

export const SORTING_OPTIONS = [
    { label: "Name", type: "Ascending" },
    { label: "Name", type: "Descending" },
    { label: "Cost", type: "High" },
    { label: "Cost", type: "Low" },
    { label: "Length", type: "High" },
    { label: "Length", type: "Low" },
    { label: "Created Date", type: "Ascending" },
    { label: "Created Date", type: "Descending" },
]

// day in seconds
export const DAY = 24 * 60 * 60;
export const MIN_REGISTRATION_TIME = 28 * DAY;
export const COMMITMENT_AGE = 150000;

// year in seconds
export const SECONDS = 31536000;

// Dashboard Tabs
export const DASHBOARD_TAB_ITEMS = [
    "Names",
    "Favorites",
    "Notifications",
    "LoyaltyPoints",
]