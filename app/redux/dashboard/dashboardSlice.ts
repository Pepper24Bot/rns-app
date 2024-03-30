import { createSlice } from "@reduxjs/toolkit"
import { Domain } from "../graphql/hooks"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store"

export interface Dashboard {

}

export interface Name {
    id: string,
    name: string,
    owner?: {
        id?: string
    }
    domain?: Partial<Domain>
    fuses?: number
    transactionID?: string
    expiryDate?: number
    blockNumber?: number
}

export interface Options {
    filter?: {
        view?: "Active" | "Expired"
        expiryDate?: "High" | "Low"
    }
    sort?: {
        by?: "Name" | "Length" | "Cost"
        order?: "Ascending" | "Descending" | "High" | "Low"
    }
}

export interface DashboardState {
    names?: Name[]
    options?: Options

    // TODO: Implement this
    favorites?: {}

    // TODO: Implement this
    notifications?: {}
}

const initialState: DashboardState = {
    names: []
}

export const dashboardState = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        updateNames: (state, { payload }: { payload: Name[] }): DashboardState => {
            state = { ...state, names: payload }
            return state
        },

    }
})

export const useDashboardState = () => {
    const dispatch = useDispatch()
    const { actions } = dashboardState

    return {
        updateNameList: (props: Name[]) => {
            dispatch(actions.updateNames(props))
        },

        useDashboard: () => {
            return useSelector((state: RootState) => {
                return state.dashboardState
            })
        },

        useNames: () => {
            return useSelector((state: RootState) => {
                return state.dashboardState.names
            })
        }
    }
}