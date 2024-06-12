import { createSlice } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store"

export type View = "Active" | "Expired"
export type ExpiryDate = "High" | "Low"
export type SortBy = "Name" | "Length" | "Cost" | "Expiry" | "Created Date"
export type SortOrder = "Ascending" | "Descending" | "High" | "Low"

export interface Options {
    /** Search By Name */
    name?: string

    filter?: {
        /** 
         * Only filteres available for now
         * are Active | Expired names
         */
        views?: View[],

    }

    sort?: {
        by?: SortBy
        order?: SortOrder
    }
}

export interface DashboardState {
    /** Filters and Sorting Options */
    options?: Options

    // TODO: Implement this
    favorites?: {}

    // TODO: Implement this
    notifications?: {}

    // TODO: Implement this
    loyalty?: {}
}

const initialState: DashboardState = {
    options: {
        name: "",
        filter: {
            views: ["Active"],
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
        updateFilterOptions: (state, { payload }: { payload: Options }): DashboardState => {
            state = { ...state, options: { ...payload } }
            return state
        },
    }
})

export const useDashboardState = () => {
    const dispatch = useDispatch()
    const { actions } = dashboardState

    return {
        updateFilterOptions: (props: Options) => {
            dispatch(actions.updateFilterOptions(props))
        },
        useFilters: () => {
            return useSelector((state: RootState) => {
                return state.dashboardState.options
            })
        }
        // TODO: Implement useFavorites
        // TODO: Implement useNotifications
    }
}