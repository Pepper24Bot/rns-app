import { createSlice } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store"

export type PaymentMethod = "ROOT" | "USDC"

export interface DomainProps {
    name: string
    year?: number
    payment?: {
        method: PaymentMethod
    }
    fee?: {
        registration?: number
        transaction?: number
        total?: number
    }
}

export interface DomainState extends DomainProps { }

const initialState: DomainState = {
    name: '',
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
        registerName: (state, { payload }: { payload: DomainProps }): DomainState => {
            state = { ...state, ...payload }
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
        registerName: (props: DomainProps) => {
            dispatch(actions.registerName({ ...props }))
        },

        // selector
        useDomain: () => {
            return useSelector((state: RootState) => {
                return state.domainState
            })
        }
    }
}