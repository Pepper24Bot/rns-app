import { createSlice } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store"
import { Domain } from "../graphql/hooks"
import { Address } from "viem"
import { PAYMENT_METHOD } from "@/services/constants"

export type PaymentMethod = "ROOT" | "USDC"
export type NameStatus = "Available" | "Not Available" | "Registered" | "Invalid"
export interface Payment {
    label: PaymentMethod,
    address: Address,
    decimals: number
}
export interface DomainProps {
    /** Used by the registration forms */
    name?: string
    labelName?: string
    status?: NameStatus
    year?: number
    payment?: Payment
    fee?: {
        registration?: number
        transaction?: number
        total?: number
    }

    /** Follow the model structure of graphql */
    owner?: {
        id?: string
    }
    domain?: Partial<Domain>,
}

export interface DomainState extends DomainProps { }

export const initialState: DomainState = {
    name: '',
    labelName: '',
    year: 1,
    payment: PAYMENT_METHOD[0] as Payment, // root
    fee: {
        registration: 0,
        transaction: 0,
    }
}

export const domainState = createSlice({
    name: 'domain',
    initialState,
    reducers: {
        /** This is for single name data only */
        updateName: (state, { payload }: { payload: DomainProps }): DomainState => {
            state = { ...state, ...payload }
            return state
        },

        udpateNameStatus: (state, { payload }: { payload: NameStatus }): DomainState => {
            state = { ...state, status: payload }
            return state
        },

        updatePaymentOption: (state, { payload }: { payload: Payment }): DomainState => {
            state.payment = payload
            return state
        },

        increaseYear: (state): DomainState => {
            state.year = state.year !== undefined ? state.year + 1 : 1
            return state
        },

        decreaseYear: (state): DomainState => {
            state.year = state.year ? state.year - 1 : 0
            return state
        }

        // TODO: Add Extend Expiry Reducer
        // TODO: Add Link Name Reducer
        // TODO: Add Image
    }
})

export const useDomainState = () => {
    const dispatch = useDispatch()
    const { actions } = domainState

    return {
        // dispatcher
        updateName: (props: DomainProps) => {
            dispatch(actions.updateName({ ...props }))
        },

        updateNameStatus: (status: NameStatus) => {
            dispatch(actions.udpateNameStatus(status))
        },

        increaseYear: () => {
            dispatch(actions.increaseYear())
        },

        decreaseYear: () => {
            dispatch(actions.decreaseYear())
        },

        updatePaymentOption: (payment: Payment) => {
            dispatch(actions.updatePaymentOption(payment))
        },

        // selector
        useDomain: () => {
            return useSelector((state: RootState) => {
                return state.domainState
            })
        }
    }
}