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
            query: ({ token = "" }) => ({
                url: `${twitterUrl}/users/me`,
                method: 'GET',
                credentials: "include",
            }),
        }),
        getTweetById: builder.query<TweetResponse, TweetRequest>({
            query: ({ tweetId }) => ({
                url: `${twitterUrl}/tweets/${tweetId}`,
                method: 'GET',
                credentials: "include",
            }),
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