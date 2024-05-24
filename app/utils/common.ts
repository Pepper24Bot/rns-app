import { ModalState } from "@/redux/modal/modalSlice";
import { formatDistanceStrict } from "date-fns";
import { isEmpty } from "lodash";
import { Response } from "@/services/interfaces";

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
export const getDate = (date: number) => {
    const newDate = new Date(date * 1000)
    return newDate
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
 * This util is very specific to get the dates of
 * - expected expiration
 * - grace period until the actual expiration
 * - remaining datys until expiration
 * 
 * @param dateCreated 
 * @param dateExpiration 
 */
export const getExpiration = (dateCreated: string, dateExpiration: string) => {
    const created = parseInt(dateCreated)
    const expiration = parseInt(dateExpiration)

    const dates = {
        expiration: "",
        distanceToExpiration: "",
        gracePeriod: "",
        distanceToGracePeriod: ""
    }

    if (!isNaN(created) && !isNaN(expiration)) {
        const currentDate = new Date().toLocaleDateString("en-US")

        const formattedExpiry = getExpiryDate(created, expiration)
        dates.expiration = formattedExpiry

        const distanceToExpiration = formatDistanceStrict(currentDate, formattedExpiry, { unit: "day" })
        dates.distanceToExpiration = distanceToExpiration

        const gracePeriod = getFormattedDate(expiration)
        dates.gracePeriod = gracePeriod

        const distanceToGracePeriod = formatDistanceStrict(currentDate, gracePeriod, { unit: "day" })
        dates.distanceToGracePeriod = distanceToGracePeriod
    }

    return dates
}

/**
 * 
 * @param createdDate 
 * @param startDate 
 * @param endDate 
 */
export const isDateWithinRange = (createdDate: number, startDate: Date, endDate: Date) => {
    const dateCreated = getDate(createdDate)

    const isWithinRange = dateCreated >= startDate && dateCreated <= endDate

    return isWithinRange
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
 * @param pathId This is the id from the url path
 * @param id This is the id passed from ModalContainer
 * @returns ModalState object
 */
export const getModalFromPath = (pathId: string = "", id: string = ""): ModalState => {
    const modals: ModalState[] = [
        {
            isModalOpen: true, // default
            props: { id: "Share RNS", fullHeight: true, fullWidth: true }
        },
        {
            isModalOpen: true, // default
            props: {
                id: "Registration Info",
                title: "Registration Process"
            }
        },
    ]

    const pattern = new RegExp(
        /(?:modal-)/g
    );

    const modalItem: ModalState = {
        isModalOpen: false,
    }

    if (isEmpty(id)) {
        const match = pathId.toLowerCase().match(pattern)
        const modal = modals.find((modal: ModalState) => {
            return (modal.props?.id === pathId.split(pattern)[1])
        })

        modalItem.isModalOpen = !isEmpty(match)
        modalItem.props = modal?.props
    }

    return modalItem
}

/**
 * 
 * @param elementId 
 */
export const scrollIntoElement = (elementId: string, options?: ScrollIntoViewOptions) => {
    const block = options?.block || "start"
    const inline = options?.inline || "nearest"

    const element = document.getElementById(elementId)
    element?.scrollIntoView({
        behavior: 'smooth',
        block,
        inline
    });
}

/**
 * 
 * @param status 
 * @returns 
 */
export const isAccountLoading = (status: string) => {
    return status !== "connected" && status !== "disconnected";
}

/**
 * TODO: Fix this
 * @param name 
 * @returns 
 */
export const isNameSupported = (name: string) => {
    const pattern = new RegExp(/[a-z|0-9]\.[a-z|0-9]/g)

    const match = name.match(pattern)
    return isEmpty(match)
}

/**
 * The commitment's age is in minute format
 * 
 * if commitment's age is less than 1 minute, commitmentToNew = makeCommitment
 * if commitment's age is more than 24 hours, commitmentToOld = makeCommitment
 * if commitment's age is within 1 minute to 24 hours (1440 minutes) = register
 * @param commitmentAge 
 */
export const isCommitmentValid = (commitmentAge: string) => {
    const age = commitmentAge.split(" minute")[0];
    return Number(age) >= 1 && Number(age) <= 1440
}

/**
 * Use this util to initialize the response of the hooks
 * @returns 
 */
export const initializeResponse = (): Response => {
    return {
        error: null,
        isSuccess: false,
        data: {
            hash: "",
            receipt: "",
        },
    };
};

/**
 * 
 * @param name 
 * @returns 
 */
export const isRootName = (name: string) => {
    const pattern = new RegExp(
        /(?:.root)/g
    );

    const match = name.toLowerCase().match(pattern)
    return !isEmpty(match)
}

/**
 * 
 * @param url 
 * @returns 
 */
export const isAddressFuturePass = (address: string = "") => {
    const pattern = new RegExp(
        /(?:0xffff)/g
    );

    const match = address.toLowerCase().match(pattern)
    return !isEmpty(match)
}