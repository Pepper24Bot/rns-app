import { createSlice } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store"

export interface Ranking {
    rank?: number,
    /** Address or Primary Name of the holder */
    owner?: string,
    /** The number of identities owned by the holder */
    nameCount?: number
}

export interface TopRanking extends Ranking { }

export interface SingleRanking extends Ranking {
    names?: string[]
}

export interface ClubRanking extends Ranking {
    names?: string[]
}

export interface LeaderBoardState {
    top: TopRanking[],
    singleEmoji: SingleRanking[],
    singleCharacter: SingleRanking[],
    "999Club": ClubRanking[],
    "10KClub": ClubRanking[],
}

const initialState: LeaderBoardState = {
    top: [],
    singleEmoji: [],
    singleCharacter: [],
    "999Club": [],
    "10KClub": []
}

export const leaderboardState = createSlice({
    name: "leaderboard",
    initialState,
    reducers: {
        updateTopRanking: (state, { payload }: { payload: TopRanking[] }): LeaderBoardState => {
            state.top = payload
            return state
        },
        updateEmojiRanking: (state, { payload }: { payload: SingleRanking[] }): LeaderBoardState => {
            state.singleEmoji = payload
            return state
        },
        updateCharacterRanking: (state, { payload }: { payload: SingleRanking[] }): LeaderBoardState => {
            state.singleCharacter = payload
            return state
        },
        update999ClubRanking: (state, { payload }: { payload: ClubRanking[] }): LeaderBoardState => {
            state["999Club"] = payload
            return state
        },
        update10kClubRanking: (state, { payload }: { payload: ClubRanking[] }): LeaderBoardState => {
            state["10KClub"] = payload
            return state
        }
    }
})

export const useLeaderboardState = () => {
    const dispatch = useDispatch()
    const { actions } = leaderboardState

    return {
        updateTopRanking: (ranking: TopRanking[]) => {
            dispatch(actions.updateTopRanking({ ...ranking }))
        },

        updateEmojiRanking: (ranking: SingleRanking[]) => {
            dispatch(actions.updateEmojiRanking({ ...ranking }))
        },

        updateCharacterRanking: (ranking: SingleRanking[]) => {
            dispatch(actions.updateCharacterRanking({ ...ranking }))
        },

        update999ClubRanking: (ranking: ClubRanking[]) => {
            dispatch(actions.update999ClubRanking({ ...ranking }))
        },

        update10kClubRanking: (ranking: ClubRanking[]) => {
            dispatch(actions.update10kClubRanking({ ...ranking }))
        },

        useLeaderboardState: () => {
            return useSelector((state: RootState) => {
                return state.leaderboardState
            })
        },

        useTopRanking: () => {
            return useSelector((state: RootState) => {
                return state.leaderboardState.top
            })
        },

        useEmojiRanking: () => {
            return useSelector((state: RootState) => {
                return state.leaderboardState.singleEmoji
            })
        },

        useCharacterRanking: () => {
            return useSelector((state: RootState) => {
                return state.leaderboardState.singleCharacter
            })
        },

        use999Ranking: () => {
            return useSelector((state: RootState) => {
                return state.leaderboardState["999Club"]
            })
        },

        use10kRanking: () => {
            return useSelector((state: RootState) => {
                return state.leaderboardState["10KClub"]
            })
        },
    }
}