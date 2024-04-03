import { HttpStatusCode } from "axios";
import { api } from "../baseSlice"

export interface AuthRequest {
    // email: string
    code: string,
    redirect?: string,
    state?: string
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

const clientId = process.env.NEXT_PUBLIC_TWITTER_API_CLIENT_ID;
const redirectUri = process.env.NEXT_PUBLIC_TWITTER_REDIRECT_CLIENT_URI;
const bearer = process.env.NEXT_PUBLIC_TWITTER_API_BEARER_TOKEN
const twitterUrl = process.env.NEXT_PUBLIC_TWITTER_API_URL

export const twitterApi = api.injectEndpoints({
    endpoints: (builder) => ({
        requestToken: builder.query<AuthResponse, AuthRequest>({
            query: ({ code, redirect, state }) => ({
                url: `${twitterUrl}/auth/twitter?code=${code}&redirect_uri=${redirect}&state=${state}`,
                method: 'GET',
                data: {
                    code,
                    grant_type: "authorization_code",
                    client_id: clientId,
                    redirect_uri: redirectUri,
                    code_verifier: "challenge"
                },
                headers: {
                    Authorization: `Bearer ${bearer}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Access-Control-Allow-Origin": "*"
                },
            }),
        }),
    })
})

export const {
    useRequestTokenQuery
} = twitterApi