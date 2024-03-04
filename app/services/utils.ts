import { formatDistance, formatDistanceStrict } from "date-fns";

/**
 * This will get the value of the provided key
 * from the document.cookie
 * @param key string
 * @returns value of string
 */
export const parseCookie = (key: string) => {
    const attributes = typeof window !== 'undefined'
        && document.cookie.split(`; ${key}=`);

    if (attributes && attributes.length === 2) {
        const value = attributes
            ?.pop()
            ?.split(';')
            ?.shift();

        return value
    }
}

/**
 * This util will return a masked address
 * @param address string
 * @returns string
 */
export const getMaskedAddress = (address: string, index = 6) => {
    return `${address.slice(0, index)}...${address.slice(-index)}`
}

/**
 * 
 * @param date 
 * @returns 
 */
export const convertNumToDate = (date: number) => {
    return new Date(date * 1000)
        .toLocaleDateString('en-CA', {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit"
        });
}

/**
 * 
 * @param date 
 * @returns 
 */
export const getRemainingDays = (date: number) => {
    const currentDate = new Date()
    const expiryDate = new Date(date * 1000)

    return formatDistanceStrict(expiryDate, currentDate, { unit: "day" })
}