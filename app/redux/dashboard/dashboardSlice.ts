import { createSlice } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store"
import { OrderBy, OrderDirection, SortBy, SortOrder, View } from "@/interfaces/components/types"

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
    /** Remove this */
    sort?: {
        by?: SortBy
        order?: SortOrder,

    }
    /**
     * The following properties are used by ensjs.getNamesForAddress
    */
    orderBy?: OrderBy
    orderDirection?: OrderDirection;
    allowExpired?: boolean

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
        allowExpired: false,
        orderBy: "createdAt",
        orderDirection: "desc",
        filter: {
            views: ["Active"],
        },
        sort: {
            by: "Created Date",
            order: "Descending"
        }
    }
}

export const dashboardState = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        updateFilterOptions: (state, { payload }: { payload: Options }): DashboardState => {
            state.options = { ...state.options, ...payload }
            return state
        },
    }
})

export const useDashboardState = () => {
    const dispatch = useDispatch()
    const { actions } = dashboardState

    return {
        updateFilterOptions: (props: Options) => {
            dispatch(actions.updateFilterOptions({ ...props }))
        },

        useDashboard: () => {
            return useSelector((state: RootState) => {
                return state.dashboardState
            })
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