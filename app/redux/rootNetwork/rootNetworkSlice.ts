import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";

export interface RootProps {
    futurePassAddress?: string,
    eoaAddress?: string,
    chain?: string,
    chainId?: string,
    nodeName?: string,
    nodeVersion?: string,
}

export interface RootNetworkState {
    data: RootProps
}

const initialState: RootNetworkState = {
    data: {
        futurePassAddress: ""
    }
}

export const rootNetworkState = createSlice({
    name: "therootnetwork",
    initialState,
    reducers: {
        updateRootDetails: (state, { payload }: { payload: RootProps }): RootNetworkState => {
            state.data = payload
            return state
        },
    }
})

export const useRootNetworkState = () => {
    const dispatch = useDispatch()
    const { actions } = rootNetworkState

    return {
        updateRootDetails: (props: RootProps) => {
            dispatch(actions.updateRootDetails(props))
        },

        useRootNetwork: () => {
            return useSelector((state: RootState) => {
                return state.rootNetworkSate
            })
        }
    }
}