import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from './baseSlice'
import { themeState } from './theme/themeSlice'
import { modalState } from './modal/modalSlice'

const store = configureStore({
    // Add reducers here
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        // TODO: Add states here
        themeState: themeState.reducer,
        modalState: modalState.reducer
    },

    // Add middleware to handle api queries
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({}).concat([baseApi.middleware])
    }
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispath = typeof store.dispatch
