import { api } from "../baseSlice"

export interface MetadataProps {
	/** name.root hash */
	hash: string,
	network: string,
	contractAddr: string
}

export interface MetaAttributes {
	trait_type: string,
	display_type: string,
	value: number
}

export interface MetadataResponse {
	is_normalized: boolean,
	name: string,
	description: string,
	attributes: MetaAttributes[],
	last_request_date: number,
	background_image: string,
	image: string,
	image_url: string
}

export const metadataApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getMetadata: builder.query<MetadataResponse, MetadataProps>({
			query: ({ hash, network, contractAddr }) => ({
				url: `https://rns-metadata.fly.dev/${network}/${contractAddr}/${hash}`,
				method: 'GET',
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*"
				},
			}),
		}),
		getNftImage: builder.query<MetadataResponse, MetadataProps>({
			query: ({ hash, network, contractAddr }) => ({
				url: `https://rns-metadata.fly.dev/${network}/${contractAddr}/${hash}/image`,
				method: 'GET',
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*"
				},
			}),
		}),
	})
})

export const {
	useGetMetadataQuery,
	useGetNftImageQuery
} = metadataApi