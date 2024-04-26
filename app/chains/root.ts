/**
 * Root (mainnet) Network
 * 
 * Docs: https://wagmi.sh/core/api/chains#create-chain
 */

import { Address, type Chain } from 'viem'

const addresses = {
    7668: {
        ensBaseRegistrarImplementation: {
            address: '0x5E89B2f53DAa0f09B4B8f194dC1a1a2C343bFCFe' as Address,
        },
        ensBulkRenewal: {
            address: '0x29435cd3D16647cc4e9eB064583E651A11C932b1' as Address,
        },
        ensEthRegistrarController: {
            address: '0x25ED7268B38c5C0095a1C40dbA795BA10D6b46C9' as Address,
        },
        ensNameWrapper: {
            address: '0x523abeFB947d78F96cBeC1ee8b101810B9b7453F' as Address,
        },
        ensPublicResolver: {
            address: '0xc27B94BbA415129E52075D63C5dA070B8f9582C0' as Address,
        },
        ensRegistry: {
            address: '0x41f6B3bA30B927d980Edb2B965C2c00dF181Be21' as Address,
        },
        ensReverseRegistrar: {
            address: '0x6b6e0e9f40A82B65CE4f144EAbcce1b53e408Be7' as Address,
        },
        ensUniversalResolver: {
            address: '0x02ea09723Cf472585EA2B1759a5b53710ADf7b8B' as Address,
        },
    },
}

export const root = {
    id: 7668,
    name: 'The Root Network - Mainnet',
    nativeCurrency: { name: 'Ripple', symbol: 'XRP', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://root.rootnet.live/archive'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Root Mainnet',
            url: 'https://explorer.rootnet.live',
        },
    },
    contracts: {
        ...addresses[7668],
    },
} as const satisfies Chain

/**
 * Use this config to programatically add this network to a wallet
 */
export const rootWalletConfig = {
    chainId: "0x1DF4",
    chainName: 'The Root Network - Mainnet',
    nativeCurrency: { name: 'Ripple', symbol: 'XRP', decimals: 18 },
    rpcUrls: ['https://root.rootnet.live/archive'],
    blockExplorerUrls: ['https://explorer.rootnet.live'],
}