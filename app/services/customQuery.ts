import { GraphQLClient } from 'graphql-request'
import { GRAPHQL_URL } from './api'
import { BaseQueryFn } from '@reduxjs/toolkit/dist/query'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'

export const client = new GraphQLClient(GRAPHQL_URL)

export interface CustomRequestOptions {
    baseUrl?: string,
    client?: GraphQLClient
}

export interface CustomRequestConfig extends AxiosRequestConfig {
    document?: string,
    variables?: any
}

export const customBaseQuery = (options: CustomRequestOptions): BaseQueryFn<any> => {
    return async (axiosRequestConfig: CustomRequestConfig) => {
        let responseData = null

        try {

            // Check if the request is from graphql
            // no provided url, graphql
            if (axiosRequestConfig?.url) {
                const response = await axios({ ...axiosRequestConfig })
                responseData = response.data
            } else {
                const graphqlQuery = {
                    operationName: 'MyQuery',
                    query: axiosRequestConfig.document,
                    variables: axiosRequestConfig.variables,
                }

                const response = await axios({
                    url: GRAPHQL_URL,
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    data: graphqlQuery,
                })

                responseData = response.data.data
            }

            return { data: responseData }

        } catch (error) {
            console.log("error-custom:: ", error)
            return {
                error: {
                    status: (error as AxiosError).response?.status,
                    data: (error as AxiosError).response?.data,
                },
            };
        }
    };
}