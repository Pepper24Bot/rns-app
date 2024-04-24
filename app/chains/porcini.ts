/**
 * Porcini (Testnet) Network
 * 
 * Docs: https://wagmi.sh/core/api/chains#create-chain
 */

import { Address, type Chain } from 'viem'

const addresses = {
    7672: {
        ensBaseRegistrarImplementation: {
            address: '0x4420F023F0133F741e182f721b1DC2D3942fcb5A' as Address,
        },
        ensBulkRenewal: {
            address: '0xA7eA86ef8BeD3B3E36e8B08B108da297B8dC5A9a' as Address,
        },
        ensEthRegistrarController: {
            address: '0xd64FA152497175B18352F44D720e55bc67faB7EB' as Address,
        },
        ensNameWrapper: {
            address: '0xBDC394b7704d3E0DC963a6Cb0Db92cBA2054da23' as Address,
        },
        ensPublicResolver: {
            address: '0xaEb82E192d9DbA65478559034924e365bE366E5a' as Address,
        },
        ensRegistry: {
            address: '0xA931c1F9621ECa562c258B81bF9fA8401f12241B' as Address,
        },
        ensReverseRegistrar: {
            address: '0xDa3E37B6aA86749efF54b48983bcB908bB501c8a' as Address,
        },
        ensUniversalResolver: {
            address: '0xB3c0AE882b35E72B7b84F7A1E0cF01fBDC617170' as Address,
        },
        // // necessary to meet the interface requirements, even though we're not using it.
        // ensDnsRegistrar: {
        //     address: '0xB32cB5677a7C971689228EC835800432B339bA2B' as Address,
        // },
        // // necessary to meet the interface requirements, even though we're not using it.
        // ensDnssecImpl: {
        //     address: '0x0fc3152971714E5ed7723FAFa650F86A4BaF30C5' as Address,
        // },
        // // necessary to meet the interface requirements, even though we're not using it.
        // multicall3: {
        //     address: '0xca11bde05977b3631167028862be2a173976ca11' as Address,
        //     blockCreated: 14_353_601,
        // },
    },
}

/**
 * Use this config to setup chain in wagmi
 */
export const porcini = {
    id: 7672,
    name: 'Root Testnet',
    nativeCurrency: { name: 'Ripple', symbol: 'XRP', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://porcini.rootnet.app/archive'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Root Testnet',
            url: 'https://explorer.rootnet.cloud',
            // apiUrl: ''
        },
    },
    contracts: {
        ...addresses[7672],
    },
    testnet: true,
} as const satisfies Chain

/**
 * Use this config to programatically add this network to a wallet
 */
export const porciniWalletConfig = {
    chainId: "0x1DF8",
    chainName: 'Root Testnet',
    nativeCurrency: { name: 'Ripple', symbol: 'XRP', decimals: 18 },
    rpcUrls: ['https://porcini.rootnet.app/archive'],
    blockExplorerUrls: ['https://explorer.rootnet.cloud'],
}