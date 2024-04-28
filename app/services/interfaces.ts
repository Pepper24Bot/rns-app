export interface ResponseData {
    hash?: string,
    receipt?: any
}

export interface ErrorResponse {
    abi: any[],
    args: string[],
    contractAddress: string,
    functionName: string,
    sender: string,
    name: string,
    message: string,
    shortMessage: string,
    cause: {
        data: {
            errorName: string
        }
    }
}

export interface Response {
    data?: ResponseData | null | any,
    isSuccess: boolean,
    error: ErrorResponse | null
}

export interface RentPrice {
    base: bigint;
    premium: bigint;
}