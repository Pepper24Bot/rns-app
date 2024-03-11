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
 * Adds 1 year
 * @param date 
 * @returns 
 */
export const getExpiryDate = (date: number) => {
    const newDate = new Date(date * 1000)
    const year = newDate.getFullYear() + 1
    const month = (newDate.getMonth() + 1).toString().padStart(2, "0")
    const day = newDate.getDate().toString().padStart(2, "0")

    return `${month}-${day}-${year}`
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

/**
 * 
 * @param date 
 * @returns string month-date-year
 */
export const getFormattedDate = (date: number) => {
    const newDate = new Date(date * 1000)
    const year = newDate.getFullYear()
    const month = (newDate.getMonth() + 1).toString().padStart(2, "0")
    const day = newDate.getDate().toString().padStart(2, "0")

    return `${month}-${day}-${year}`
}

/**
 * This util is very specific to get the dates of
 * - expected expiration
 * - grace period until the actual expiration
 * - remaining datys until expiration
 * 
 * @param dateCreated 
 * @param dateExpiration 
 */
export const getExpiration = (dateCreated: number, dateExpiration?: number) => {
    const dates = {
        expiration: "",
        distanceToExpiration: "",
        gracePeriod: "",
        distanceToGracePeriod: ""
    }

    // TODO: Check why does new Date fails sometimes
    const currentDate = new Date().toLocaleDateString()
    console.log("currentDate:: ", currentDate)

    const formattedExpiration = getExpiryDate(dateCreated)
    dates.expiration = formattedExpiration

    const distance = formatDistanceStrict(currentDate, formattedExpiration, { unit: "day" })
    dates.distanceToExpiration = distance

    if (dateExpiration) {
        const gracePeriod = getFormattedDate(dateExpiration)
        dates.gracePeriod = gracePeriod

        const distance = formatDistanceStrict(currentDate, gracePeriod, { unit: "day" })
        dates.distanceToGracePeriod = distance
    }

    return dates
}
