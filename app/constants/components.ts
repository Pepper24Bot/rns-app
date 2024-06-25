import { SortingOption } from "@/interfaces/global/components";
import { OrderDirection } from "@/redux/graphql/hooks";

export const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000"

export const DEFAULT_DEBOUNCE = 500;

/** https://explorer.rootnet.live/tokens */
export const PAYMENT_METHOD = [
    { label: "ROOT", decimals: 6, address: "0xcCcCCccC00000001000000000000000000000000" },
    { label: "USDC", decimals: 6, address: "0xCCcCCcCC00000C64000000000000000000000000" }
]

/** Aligns with Domain_OrderBy Graphql */
export enum OrderBy {
    CreatedAt = 'createdAt',
    ExpiryDate = 'expiryDate',
    Id = 'id',
    IsMigrated = 'isMigrated',
    LabelName = 'labelName',
    Labelhash = 'labelhash',
    LabelNameLength = 'labelName_length',
    Name = 'name',
    Owner = 'owner',
    OwnerId = 'owner__id',
    RegistrantId = 'registrant__id',
    RegistrationCost = 'registration__cost',
    RegistrationExpiryDate = 'registration__expiryDate',
    RegistrationId = 'registration__id',
    RegistrationLabelName = 'registration__labelName',
    RegistrationRegistrationDate = 'registration__registrationDate',
    ResolvedAddress = 'resolvedAddress',
    ResolvedAddressId = 'resolvedAddress__id',
    ResolverAddress = 'resolver__address',
    ResolverContentHash = 'resolver__contentHash',
    ResolverId = 'resolver__id',
    SubdomainCount = 'subdomainCount',
    WrappedDomainExpiryDate = 'wrappedDomain__expiryDate',
    WrappedDomainFuses = 'wrappedDomain__fuses',
    WrappedDomainId = 'wrappedDomain__id',
    WrappedDomainName = 'wrappedDomain__name',
    WrappedOwner = 'wrappedOwner',
    WrappedOwnerId = 'wrappedOwner__id',
}

export const SORTING_OPTIONS: SortingOption[] = [
    {
        label: "Name",
        type: "Ascending",
        orderBy: OrderBy.Name,
        orderDirection: OrderDirection.Asc
    },
    {
        label: "Name",
        type: "Descending",
        orderBy: OrderBy.Name,
        orderDirection: OrderDirection.Desc
    },
    {
        label: "Cost",
        type: "High",
        orderBy: OrderBy.RegistrationCost,
        orderDirection: OrderDirection.Desc
    },
    {
        label: "Cost",
        type: "Low",
        orderBy: OrderBy.RegistrationCost,
        orderDirection: OrderDirection.Asc
    },
    {
        label: "Expiry",
        type: "High",
        orderBy: OrderBy.RegistrationExpiryDate,
        orderDirection: OrderDirection.Desc
    },
    {
        label: "Expiry",
        type: "Low",
        orderBy: OrderBy.RegistrationExpiryDate,
        orderDirection: OrderDirection.Asc
    },
    {
        label: "Length",
        type: "High",
        orderBy: OrderBy.LabelNameLength,
        orderDirection: OrderDirection.Asc
    },
    {
        label: "Length",
        type: "Low",
        orderBy: OrderBy.LabelNameLength,
        orderDirection: OrderDirection.Desc
    },
    {
        label: "Created Date",
        type: "Ascending",
        orderBy: OrderBy.RegistrationRegistrationDate,
        orderDirection: OrderDirection.Asc
    },
    {
        label: "Created Date",
        type: "Descending",
        orderBy: OrderBy.RegistrationRegistrationDate,
        orderDirection: OrderDirection.Desc
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

// Leaderboard Tabs
export const LEADERBOARD_TAB_ITEMS = [
    "Top 50",
    "Single Emoji",
    "Single Character",
    "999 Club",
    "10k Club",
]