import { createSlice } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store"
import { Domain } from "../graphql/hooks"

export type PaymentMethod = "ROOT" | "USDC"

export interface DomainProps {
    /** Used by the registration forms */
    name?: string
    labelName?: string
    year?: number
    payment?: {
        method: PaymentMethod
    }
    fee?: {
        registration?: number
        transaction?: number
        total?: number
    }

    /** Follow the model structure of graphql */
    owner?: {
        id?: string
    }
    domain?: Partial<Domain>
}

export interface DomainState extends DomainProps { }

export const initialState: DomainState = {
    name: '',
    labelName: '',
    year: 1,
    payment: {
        method: 'ROOT'
    },
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

        updatePaymentOption: (state, { payload }: { payload: PaymentMethod }): DomainState => {
            state.payment = { method: payload }
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

        increaseYear: () => {
            dispatch(actions.increaseYear())
        },

        decreaseYear: () => {
            dispatch(actions.decreaseYear())
        },

        updatePaymentOption: (method: PaymentMethod) => {
            dispatch(actions.updatePaymentOption(method))
        },

        // selector
        useDomain: () => {
            return useSelector((state: RootState) => {
                return state.domainState
            })
        }
    }
}