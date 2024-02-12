/**
 * Root (mainnet) Network
 * 
 * Docs: https://wagmi.sh/core/api/chains#create-chain
 */

import { type Chain } from 'viem'

export const root = {
    id: 7668,
    name: 'Root Mainnet',
    nativeCurrency: { name: 'Ripple', symbol: 'XRP', decimals: 6 },
    rpcUrls: {
        default: {
            http: ['https://root.rootnet.live/archive'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Root Mainnet',
            url: 'https://explorer.rootnet.live',
            // apiUrl: ''
        },
    },
    // contracts: {
    //     ensRegistry: {
    //         address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    //     },
    //     ensUniversalResolver: {
    //         address: '0x8cab227b1162f03b8338331adaad7aadc83b895e',
    //         blockCreated: 18_958_930,
    //     },
    //     multicall3: {
    //         address: '0xca11bde05977b3631167028862be2a173976ca11',
    //         blockCreated: 14_353_601,
    //     },
    // },
} as const satisfies Chain
