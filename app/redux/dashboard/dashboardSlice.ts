import { createSlice } from "@reduxjs/toolkit"
import { Domain } from "../graphql/hooks"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store"

export interface Dashboard {

}

export type View = "Active" | "Expired"
export type ExpiryDate = "High" | "Low"
export type SortBy = "Name" | "Length" | "Cost" | "Created Date"
export type SortOrder = "Ascending" | "Descending" | "High" | "Low"

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
        views?: View[]
        expiryDate?: ExpiryDate[]
    }
    sort?: {
        by?: SortBy
        order?: SortOrder
    }
}

export interface DashboardState {
    names?: Name[]
    isNameListLoading?: boolean,

    options?: Options

    // TODO: Implement this
    favorites?: {}

    // TODO: Implement this
    notifications?: {}

    // TODO: Implement this
    loyalty?: {}
}

const initialState: DashboardState = {
    names: [],
    options: {
        filter: {
            views: ["Active", "Expired"],
            expiryDate: ["High", "Low"]
        },
        sort: {
            by: "Created Date",
            order: "Ascending"
        }
    }
}

export const dashboardState = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        updateNames: (state, { payload }: { payload: Name[] }): DashboardState => {
            state = { ...state, names: payload }
            return state
        },
        updateFilterOptions: (state, { payload }: { payload: Options }): DashboardState => {
            state = { ...state, options: { ...payload } }
            return state
        },
        toggleNamesLoading: (state, { payload }: { payload: boolean }): DashboardState => {
            state = { ...state, isNameListLoading: payload }
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
        updateFilterOptions: (props: Options) => {
            dispatch(actions.updateFilterOptions(props))
        },
        toggleNamesLoading: (isLoading: boolean = false) => {
            dispatch(actions.toggleNamesLoading(isLoading))
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
        },
        useFilters: () => {
            return useSelector((state: RootState) => {
                return state.dashboardState.options
            })
        }
    }
}