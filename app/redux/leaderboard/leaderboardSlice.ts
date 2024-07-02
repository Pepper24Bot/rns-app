import { createSlice } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store"
import { NameResponse } from "../graphql/graphqlApi"

export interface Ranking {
    /** Address or Primary Name of the holder */
    owner?: string,
    /** identities */
    names?: NameResponse[],
    /** The number of identities owned by the holder */
    total?: number,

    primary?: string,

    label?: string,

    expiryDate?: string
}

export interface TopRanking {
    isFetched?: boolean,
    ranking?: Ranking[]
}

export interface SingleRanking {
    isFetched?: boolean,
    ranking?: Ranking[]
}

export interface ClubRanking {
    isFetched?: boolean,
    ranking?: Ranking[]
}

export interface LeaderBoardState {
    top?: TopRanking,
    singleEmoji?: SingleRanking,
    singleCharacter?: SingleRanking,
    oneKClub?: SingleRanking,
    tenKClub?: SingleRanking,
    totalCountNames?: number,
    allRankings?: Ranking[]
}

const initialState: LeaderBoardState = {
    top: {
        isFetched: false,
        ranking: [],
    },
    singleEmoji: {
        isFetched: false,
        ranking: [],
    },
    singleCharacter: {
        isFetched: false,
        ranking: [],
    },
    oneKClub: {
        isFetched: false,
        ranking: [],
    },
    tenKClub: {
        isFetched: false,
        ranking: [],
    },
}

export const leaderboardState = createSlice({
    name: "leaderboard",
    initialState,
    reducers: {
        updateRankings: (state, { payload }: { payload: LeaderBoardState }): LeaderBoardState => {
            state = { ...state, ...payload }
            return state
        },

        updateTopRanking: (state, { payload }: { payload: TopRanking }): LeaderBoardState => {
            state.top = payload
            return state
        },
        updateEmojiRanking: (state, { payload }: { payload: SingleRanking }): LeaderBoardState => {
            state.singleEmoji = payload
            return state
        },
        updateCharacterRanking: (state, { payload }: { payload: SingleRanking }): LeaderBoardState => {
            state.singleCharacter = payload
            return state
        },
        update999ClubRanking: (state, { payload }: { payload: SingleRanking }): LeaderBoardState => {
            state.oneKClub = payload
            return state
        },
        update10kClubRanking: (state, { payload }: { payload: SingleRanking }): LeaderBoardState => {
            state.tenKClub = payload
            return state
        }
    }
})

export const useLeaderboardState = () => {
    const dispatch = useDispatch()
    const { actions } = leaderboardState

    return {
        updateRankings: (ranking: LeaderBoardState) => {
            dispatch(actions.updateRankings({ ...ranking }))
        },

        updateTopRanking: (ranking: TopRanking) => {
            dispatch(actions.updateTopRanking({ ...ranking }))
        },

        updateEmojiRanking: (ranking: SingleRanking) => {
            dispatch(actions.updateEmojiRanking({ ...ranking }))
        },

        updateCharacterRanking: (ranking: SingleRanking) => {
            dispatch(actions.updateCharacterRanking({ ...ranking }))
        },

        update999ClubRanking: (ranking: SingleRanking) => {
            dispatch(actions.update999ClubRanking({ ...ranking }))
        },

        update10kClubRanking: (ranking: SingleRanking) => {
            dispatch(actions.update10kClubRanking({ ...ranking }))
        },

        useLeaderboard: () => {
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
                return state.leaderboardState.oneKClub
            })
        },

        use10kRanking: () => {
            return useSelector((state: RootState) => {
                return state.leaderboardState.tenKClub
            })
        },
    }
}