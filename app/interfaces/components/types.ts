export type PaymentMethod = "ROOT" | "USDC"
export type NameStatus = "Available" | "Not Available" | "Registered" | "Invalid" | "Not Supported"

export type View = "Active" | "Expired"
export type ExpiryDate = "High" | "Low"
export type SortBy = "Name" | "Length" | "Cost" | "Expiry" | "Created Date"
export type SortOrder = "Ascending" | "Descending" | "High" | "Low"

export type OrderBy = 'expiryDate'
    | 'name'
    | 'labelName'
    | 'createdAt'
    | 'cost'
    | 'length'

export type OrderDirection = 'asc' | 'desc'