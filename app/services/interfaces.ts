export interface Response {
    data?: any,
    isSuccess: boolean,
    error: null | string
}

export interface RentPrice {
    base: bigint;
    premium: bigint;
}