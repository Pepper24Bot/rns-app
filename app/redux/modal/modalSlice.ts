import { createSlice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { RootState } from "../store"
import { isEmpty } from "lodash"

export interface Description {
    content: string
    highlights?: string[]
}

export interface ModalProps {
    node?: React.ReactNode
    title?: string
    description?: string | Description
    id?: string

    // Implement as needed
    saveCallback?: () => void,
    cancelCallback?: () => void,
    clearCallback?: () => void,
}

export interface ModalState {
    isModalOpen: boolean,
    props?: ModalProps
}

const initialState: ModalState = {
    isModalOpen: false
}

export const modalState = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        toggleModal: (state, { payload }: { payload: ModalProps }): void => {
            if (isEmpty(payload)) {
                console.log('[false] toggle modal....')
                state.isModalOpen = false
            }

            if (!isEmpty(payload)) {
                console.log('[true] toggle modal....')
                state.isModalOpen = true
                state.props = payload
            }
        },

        closeModal: (state): void => {
            state.isModalOpen = false
        }
    }
})

// selector and dispatch
export const useModalState = () => {
    const dispatch = useDispatch()
    const { actions } = modalState

    return {
        toggleModal: (props: ModalProps) => {
            dispatch(actions.toggleModal({ ...props }))
        },

        closeModal: () => {
            dispatch(actions.closeModal())
        },

        useModal: () => {
            return useSelector((state: RootState) => {
                return state.modalState
            })
        }
    }
}