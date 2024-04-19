import { configureStore } from '@reduxjs/toolkit'
import { api } from './baseSlice'
import { themeState } from './theme/themeSlice'
import { modalState } from './modal/modalSlice'
import { domainState } from './domain/domainSlice'
import { dashboardState } from './dashboard/dashboardSlice'
import { rootNetworkState } from './rootNetwork/rootNetworkSlice'
import { shareState } from './share/shareSlice'

const store = configureStore({
    // Add reducers here
    reducer: {
        [api.reducerPath]: api.reducer,
        // TODO: Add states here
        themeState: themeState.reducer,
        modalState: modalState.reducer,
        domainState: domainState.reducer,
        dashboardState: dashboardState.reducer,
        rootNetworkSate: rootNetworkState.reducer,
        shareState: shareState.reducer
    },

    // Add middleware to handle api queries
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({}).concat([api.middleware])
    }
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispath = typeof store.dispatch
