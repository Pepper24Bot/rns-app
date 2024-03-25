import { api } from "../baseSlice"

export interface TwitterProps {
    // email: string
    code: string
}

// TODO: Move this in env
const twitterUrl = "https://api.twitter.com/2/oauth2"
const clientId = "QmczejlDYjJkT25wWEpKN3Fyb1A6MTpjaQ";
const redirectUri = "http://localhost:3000";
const scope = "tweet.read%20tweet.write%20users.read";
const bearer = "AAAAAAAAAAAAAAAAAAAAAPvoswEAAAAAH%2FJJ9WnCZxRX6zM6PemmsG9C4Hs%3DZNdpdVFF94RaD9HuTcF7zA1RZ0ZDGfG9qnHtirP5TsWhlnCK2t"

export const twitterApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createAccessToken: builder.mutation<{}, TwitterProps>({
            query: ({ code }) => ({
                url: `${twitterUrl}/token`,
                method: 'POST',
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
    useCreateAccessTokenMutation
} = twitterApi