import { createSlice } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store"
import { SortBy, SortOrder, View } from "@/interfaces/global/types"
import { OrderDirection } from "../graphql/hooks"
import { OrderBy } from "@/constants/components"
import { DomainResponse } from "../graphql/graphqlApi"

export interface Options {
    /** Search By Name */
    name?: string
    /** Active page in Pagination */
    page?: number
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

    identities?: {
        /** Currently displayed names - used in pagination */
        displayedNames?: DomainResponse[]
    }

    // TODO: Implement this
    favorites?: {}

    // TODO: Implement this
    notifications?: {}

    // TODO: Implement this
    loyalty?: {}
}

const initialState: DashboardState = {
    identities: {
        displayedNames: undefined
    },
    options: {
        name: "",
        page: 1,
        allowExpired: false,
        orderBy: OrderBy.RegistrationRegistrationDate,
        orderDirection: OrderDirection.Desc,
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
        updateDisplayedNames: (state, { payload }: { payload: DomainResponse[] }): DashboardState => {
            state.identities = { ...state.identities, displayedNames: [...payload] }
            return state
        },
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

        updateDisplayedNames: (props: DomainResponse[]) => {
            dispatch(actions.updateDisplayedNames([...props]))
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