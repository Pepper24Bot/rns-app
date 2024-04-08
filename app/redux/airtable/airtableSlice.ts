import { api } from "../baseSlice"

export interface EmailProps {
    email: string
}

const apiKey = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
const baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
const airTableUrl = process.env.NEXT_PUBLIC_AIRTABLE_URL;

export const airtableApi = api.injectEndpoints({
    endpoints: (builder) => ({
        subscribesEmail: builder.mutation<{}, EmailProps>({
            query: ({ email }) => ({
                url: `${airTableUrl}/${baseId}/Subscription`,
                method: 'POST',
                data: { fields: { Email: email, } },
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            }),
        }),
    })
})

export const {
    useSubscribesEmailMutation
} = airtableApi