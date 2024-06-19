import { createSlice } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store"
import { Address } from "viem"
import { PAYMENT_METHOD } from "@/constants/components"
import { PaymentMethod } from "@/interfaces/global/types"

export interface Payment {
    label: PaymentMethod,

    /** Token's Address */
    address: Address,

    /** Token's Decimal */
    decimals: number
}

export interface Fees {
    registration?: number
    transaction?: number
    total?: number
}

export interface FormProps {
    primary?: boolean
    year?: number
    payment?: Payment
    fee?: Fees
}

export interface FormState extends FormProps { }

export const initialState: FormState = {
    primary: false,
    year: 1,
    payment: PAYMENT_METHOD[0] as Payment, // root
    fee: {
        registration: 0,
        transaction: 0,
    }
}

export const formState = createSlice({
    name: 'domain',
    initialState,
    reducers: {
        updateForm: (state, { payload }: { payload: FormProps }): FormState => {
            state = { ...state, ...payload }
            return state
        },

        updateFees: (state, { payload }: { payload: Fees }): FormState => {
            state.fee = payload
            return state
        },

        updatePaymentOption: (state, { payload }: { payload: Payment }): FormState => {
            state.payment = payload
            return state
        },

        increaseYear: (state): FormState => {
            state.year = state.year !== undefined ? state.year + 1 : 1
            return state
        },

        decreaseYear: (state): FormState => {
            state.year = state.year ? state.year - 1 : 0
            return state
        },

        setAsPrimary: (state, { payload }: { payload: boolean }): FormState => {
            state.primary = payload
            return state
        },

        resetFormState: (state): FormState => {
            state = initialState;
            return state
        },
    }
})

export const useFormState = () => {
    const dispatch = useDispatch()
    const { actions } = formState

    return {
        updateForm: (props: FormProps) => {
            dispatch(actions.updateForm({ ...props }))
        },

        updateFees: (fees: Fees) => {
            dispatch(actions.updateFees({ ...fees }))
        },

        updatePaymentOption: (payment: Payment) => {
            dispatch(actions.updatePaymentOption({ ...payment }))
        },

        resetFormState: () => {
            dispatch(actions.resetFormState())
        },

        increaseYear: () => {
            dispatch(actions.increaseYear())
        },

        decreaseYear: () => {
            dispatch(actions.decreaseYear())
        },

        setAsPrimary: (primary: boolean) => {
            dispatch(actions.setAsPrimary(primary))
        },

        // selector
        useForm: () => {
            return useSelector((state: RootState) => {
                return state.formState
            })
        }
    }
}