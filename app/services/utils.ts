import { formatDistanceStrict } from "date-fns";
import { isEmpty } from "lodash";

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
 * 
 * @param date 
 * @returns 
 */
export const getExpiryDate = (dateCreated: number, dateExpiration: number) => {
    // Get the year of expiration
    const expiryDate = new Date(dateExpiration * 1000)
    const yearExpiry = expiryDate.getFullYear()

    // Get the date created
    const createdDate = new Date(dateCreated * 1000)
    const monthCreated = (createdDate.getMonth() + 1).toString().padStart(2, "0")
    const dayCreated = createdDate.getDate().toString().padStart(2, "0")

    return `${monthCreated}-${dayCreated}-${yearExpiry}`
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
 * This util is very specific to get the dates of
 * - expected expiration
 * - grace period until the actual expiration
 * - remaining datys until expiration
 * 
 * @param dateCreated 
 * @param dateExpiration 
 */
export const getExpiration = (dateCreated: number, dateExpiration: number) => {
    const dates = {
        expiration: "",
        distanceToExpiration: "",
        gracePeriod: "",
        distanceToGracePeriod: ""
    }

    // TODO: Check why does new Date fails sometimes
    const currentDate = new Date().toLocaleDateString()
    const formattedExpiry = getExpiryDate(dateCreated, dateExpiration)
    dates.expiration = formattedExpiry

    const distanceToExpiration = formatDistanceStrict(currentDate, formattedExpiry, { unit: "day" })
    dates.distanceToExpiration = distanceToExpiration

    const gracePeriod = getFormattedDate(dateExpiration)
    dates.gracePeriod = gracePeriod

    const distanceToGracePeriod = formatDistanceStrict(currentDate, gracePeriod, { unit: "day" })
    dates.distanceToGracePeriod = distanceToGracePeriod

    return dates
}

/**
 * 
 * @param email 
 * @returns 
 */
export const isEmailValid = (email: string) => {
    const pattern = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g)

    const match = email.toLowerCase().match(pattern)

    return !isEmpty(match)
}

/**
 * 
 * @param url 
 * @returns 
 */
export const isUrlGraphql = (url: string = "") => {
    const pattern = new RegExp(
        /(?:subgraphs|graphql)/g
    );

    const match = url.toLowerCase().match(pattern)

    return !isEmpty(match)
}

/**
 * 
 * @param params 
 * @returns 
 */
export const getModal = (params: string = "") => {
    const pattern = new RegExp(
        /(?:modal-)/g
    );

    const match = params.toLowerCase().match(pattern)
    const type = params.split(pattern)

    return {
        isModalOpen: !isEmpty(match),
        modalType: type[1]
    }
}

/**
 * 
 * @param url 
 * @returns 
 */
export const isAddressFuturePass = (url: string = "") => {
    const pattern = new RegExp(
        /(?:0xffff)/g
    );

    const match = url.toLowerCase().match(pattern)
    return !isEmpty(match)
}