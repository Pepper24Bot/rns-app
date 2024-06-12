import { ModalState } from "@/redux/modal/modalSlice";
import { formatDistanceStrict } from "date-fns";
import { isEmpty } from "lodash";
import { Response } from "@/services/interfaces";
import { OrderBy, OrderDirection } from "@/interfaces/components/types";
import emojiRegex from "emoji-regex";

export type CharacterSet = 'alphanumeric' | 'digit' | 'emoji' | 'letter' | 'mixed';
export const characterSet: { [key: string]: CharacterSet } = Object.freeze({
    ALPHANUMERIC: 'alphanumeric',
    DIGIT: 'digit',
    EMOJI: 'emoji',
    LETTER: 'letter',
    MIXED: 'mixed',
});

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
 * @param createdDate 
 * @param startDate 
 * @param endDate 
 */
export const isDateWithinRange = (createdDate: Date, startDate: Date, endDate: Date) => {
    const isWithinRange = createdDate >= startDate && createdDate <= endDate
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

/**
 * 
 * @param label 
 * @returns 
 */
export function findCharacterSet(label: string): CharacterSet {
    // regex digit only
    if (/^[0-9]+$/.test(label)) return characterSet.DIGIT;
    // regex latin letters only
    if (/^[a-zA-Z]+$/.test(label)) return characterSet.LETTER;
    // regex unicode mode, alphanumeric
    // \p{L} or \p{Letter}: any kind of letter from any language.
    // \p{N} or \p{Number}: any kind of numeric character in any script.
    if (/^[\p{L}\p{N}]*$/u.test(label)) return characterSet.ALPHANUMERIC;
    // regex emoji only
    if (/^[\p{Extended_Pictographic}|\p{Emoji_Component}]+$/gu.test(label)) return characterSet.EMOJI;

    return characterSet.MIXED;
}

/**
 * 
 * @param label 
 * @returns 
 */
export function isASCII(label: string) {
    // function excludes all known emojis from ascii check
    const emojiRxp = emojiRegex();
    // check both ascii and emoji character set
    const newEmojiRxp = new RegExp(
        `^([\x00-\x7F]|${emojiRxp.source})+$`,
        emojiRxp.flags
    );
    return newEmojiRxp.test(label);
}

/**
 * TODO: Fix this
 * @param name 
 * @returns 
 */
export const isNameSupported = (name: string) => {
    const value = encodeURI(name)
    const pattern = new RegExp(/[a-z|0-9|^\x00-\x7F]\.[a-z|0-9|^\x00-\x7F]/g)
    const match = value.match(pattern)

    return isEmpty(match)
}

/**
 * TODO: Optimize this
 * @param content 
 * @param highlights 
 * @param index 
 * @returns 
 */
export const getHighlightedTexts = (
    content: string,
    highlights: { text: string; isUrl?: boolean }[] = [],
    index: number = 0
) => {
    const highlightedTexts = highlights.map((option) => {
        return `(${option.text})`;
    });

    const pattern = RegExp(highlightedTexts.join("|"));
    const texts = content.split(pattern);

    return texts;
};

/**
 * TODO: Optimize this
 * @param text 
 * @param highlights 
 * @returns 
 */
export const getHighlight = (
    text: string,
    highlights: { text: string; isUrl?: boolean }[] = []
) => {
    const option = highlights.find((highlight) => {
        return highlight.text.match(text);
    });

    return option;
};

/**
 * 
 * @param ref 
 * @returns 
 */
export const isTooltipShowing = (ref: React.MutableRefObject<HTMLDivElement | null>) => {
    const scrollWidth = ref?.current?.scrollWidth || 0;
    const clientWidth = ref?.current?.clientWidth || 0;

    return scrollWidth > clientWidth
}

/**
 * 
 * @param expiry 
 * @returns 
 */
export const getDistanceToExpiration = (expiry: Date) => {
    const current = new Date().toLocaleDateString("en-US")
    const distance = formatDistanceStrict(
        current,
        expiry,
        { unit: "day" }
    );

    return distance
}

/**
 * 
 * @param date 
 * @returns 
 */
export const formatDate = (date: Date) => {
    const newDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });

    return newDate.replace(/[/]/g, "-")
}

/**
 * 
 * @param expiry the expiration date of an identity
 * @returns distance in days format and expiration in mm-dd-yyyy
 */
export const getExpiry = (expiry?: Date) => {
    const date = expiry ? expiry : new Date();

    const distance = getDistanceToExpiration(date);
    const expiration = formatDate(date);

    return {
        distance,
        expiration
    }
}

/**
 * Temporary util to check where the date 
 * created is within the quest period 
 * 
 * @param date the date when the identity is created
 * @returns 
 */
export const isRegisteredDuringQuest = (date?: Date) => {
    if (date) {
        const start = new Date("2024-05-28T08:00:00.000+10:00");
        const end = new Date("2024-06-25T08:00:00.000+10:00");
        const isShareable = isDateWithinRange(date, start, end);

        return isShareable
    }

    return false
}

/**
 * 
 * @param allowExpired pass here the data from the dashboard state
 */
export const getIsAllowedExpired = (allowExpired: boolean = false) => {
    const filterViews = (parseCookie("filterByViews") || "Active")

    // prioritize the cookies value than the state
    return filterViews.includes("Expired") || allowExpired;
}

export const getOrderBy = (orderBy: OrderBy = "createdAt") => {
    // prioritize the cookies value than the state
    return (parseCookie("orderBy") || orderBy) as any;
}

export const getOrderDirection = (orderDirection: OrderDirection = "desc") => {
    // prioritize the cookies value than the state
    return (parseCookie("orderDirection") || orderDirection) as OrderDirection;
}