import axios, { AxiosError, HttpStatusCode } from "axios";
import { api } from "../baseSlice"
import { getHeader, refetchTwitterToken } from "@/services/customQuery";

/**
 * TODO:
 * Move these interfaces in a service folder
 * ../services/interfaces/twitter.ts
 */

export interface Request {
    token?: string,
}

export interface AuthReqeuest extends Request {
    redirect?: string,
    state?: string,
    code?: string,
}

export interface TweetRequest extends Request {
    tweetId?: string
}

export interface WehbookRequest {
    futurePass?: string
}

export interface AuthResponse {
    status?: HttpStatusCode,
    isSuccess: boolean,
    token: {
        state?: string,
        access_token?: string,
        token_type?: string,
        scope?: string,
        expires_at?: number,
    }
}

export interface UserResponse {
    status?: HttpStatusCode,
    isSuccess: boolean,
    data?: {
        id: string,
        name: string,
        username: string
    }
}

export interface TweetResponse {
    status?: HttpStatusCode,
    isSuccess: boolean,
    data?: any
}

const bearer = process.env.NEXT_PUBLIC_TWITTER_API_BEARER_TOKEN
const twitterUrl = process.env.NEXT_PUBLIC_TWITTER_API_URL

const webHook = process.env.NEXT_PUBLIC_WEBHOOK_URL
const apiKey = process.env.NEXT_PUBLIC_WEBHOOK_API

export const shareApi = api.injectEndpoints({
    endpoints: (builder) => ({
        triggerWebhook: builder.mutation<{}, WehbookRequest>({
            query: ({ futurePass }) => ({
                url: webHook,
                method: 'POST',
                data: {
                    "end_user_id": futurePass,
                    "end_user_type": "FUTUREPASS"
                },
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
            }),
        }),
        getAccessToken: builder.query<AuthResponse, AuthReqeuest>({
            query: ({ code, redirect, state }) => ({
                url: `${twitterUrl}/auth/twitter?code=${code}&redirect_uri=${redirect}&state=${state}`,
                method: 'GET',
                headers: getHeader(bearer)
            }),
        }),
        getRefreshToken: builder.query<AuthResponse, AuthReqeuest>({
            query: ({ token = "" }) => ({
                url: `${twitterUrl}/auth/twitter/token`,
                method: 'GET',
                headers: getHeader(token)
            }),
        }),
        getUserDetails: builder.query<UserResponse, Request>({
            async queryFn({ token = "" }) {
                try {
                    const userResponse = await axios({
                        url: `${twitterUrl}/users/me`,
                        method: 'GET',
                        headers: getHeader(bearer)
                    })

                    return { data: userResponse.data }

                } catch (error) {
                    const errorData = error as AxiosError

                    if (errorData?.response?.status === 401) {
                        // Refresh Token
                        const newToken = await refetchTwitterToken(token)

                        //  retry user request
                        const userResponse = await axios({
                            url: `${twitterUrl}/users/me`,
                            method: 'GET',
                            headers: getHeader(newToken)
                        })

                        return userResponse.status === 200
                            ? { data: userResponse.data }
                            : { error: userResponse }
                    }

                    return { data: error }
                }
            },
        }),
        getTweetById: builder.query<TweetResponse, TweetRequest>({
            async queryFn({ tweetId }) {
                try {
                    const searchResponse = await axios({
                        url: `${twitterUrl}/tweets/${tweetId}`,
                        method: 'GET',
                        headers: getHeader(bearer),
                    })

                    return { data: searchResponse.data }
                } catch (error) {
                    const errorData = error as AxiosError

                    if (errorData?.response?.status === 401) {
                        const newToken = await refetchTwitterToken(bearer)

                        //  retry user request
                        const searchResponse = await axios({
                            url: `${twitterUrl}/tweets/${tweetId}`,
                            method: 'GET',
                            headers: getHeader(newToken)
                        })

                        return { data: searchResponse.data }
                    }

                    return { error: errorData.response }
                }
            },
        }),
    })
})

export const {
    useGetAccessTokenQuery,
    useGetUserDetailsQuery,
    useGetTweetByIdQuery,
    useGetRefreshTokenQuery,
    useTriggerWebhookMutation
} = shareApi