import { configureStore } from '@reduxjs/toolkit'
import { api } from './baseSlice'
import { themeState } from './theme/themeSlice'
import { modalState } from './modal/modalSlice'
import { formState } from './form/formSlice'
import { dashboardState } from './dashboard/dashboardSlice'
import { rootNetworkState } from './rootNetwork/rootNetworkSlice'
import { shareState } from './share/shareSlice'
import { leaderboardState } from './leaderboard/leaderboardSlice'

const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        themeState: themeState.reducer,
        modalState: modalState.reducer,
        formState: formState.reducer,
        dashboardState: dashboardState.reducer,
        leaderboardState: leaderboardState.reducer,
        rootNetworkSate: rootNetworkState.reducer,
        shareState: shareState.reducer
    },

    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: {
                ignoredActionPaths: [
                    'payload.data.item.createdAt.date',
                    'payload.data.item.expiryDate.date',
                    'payload.data.item.registrationDate.date',
                    'RnsApi.queries.NamesByAddress'
                ],
                ignoredPaths: [
                    'modalState.props.data.item.createdAt.date',
                    'modalState.props.data.item.expiryDate.date',
                    'modalState.props.data.item.registrationDate.date'
                ],
            }
        }).concat([api.middleware])
    }
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispath = typeof store.dispatch
