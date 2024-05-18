/**
 * Root (mainnet) Network
 * 
 * Docs: https://wagmi.sh/core/api/chains#create-chain
 */

import { Address, type Chain } from 'viem'

const addresses = {
  7668: {
    ensBaseRegistrarImplementation: {
      address: "0xEeD3C3c547751e23020f4cb506FbA37baEb3308D" as Address,
    },
    ensBulkRenewal: {
      address: "0x0193eFBF9504422700295C022766891b0b10049F" as Address,
    },
    ensEthRegistrarController: {
      address: "0xc85E5802BADE56Facb93bb373da6bA7c1902b19c" as Address,
    },
    ensNameWrapper: {
      address: "0x44640D662A423d738D5ebF8B51E57AfC0f2cf4Df" as Address,
    },
    ensPublicResolver: {
      address: "0x870bC2604D6EAC536c791A603bFDE1A1448e168e" as Address,
    },
    ensRegistry: {
      address: "0xEC58C26B8E0A4bc0fe1ad21D216e4ecAd9e037A8" as Address,
    },
    ensReverseRegistrar: {
      address: "0xfFF7719aaB38eadE6A1CfdA864a174B715e9d673" as Address,
    },
    ensUniversalResolver: {
      address: "0x7808dF0A1F1d58c6Ad0F3bA07E749D730F02f13A" as Address,
    },
  },
};

export const root = {
  id: 7668,
  name: 'The Root Network',
  nativeCurrency: { name: 'Ripple', symbol: 'XRP', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://root.rootnet.live/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Root Mainnet',
      url: 'https://rootscan.io/',
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
  chainName: 'The Root Network',
  nativeCurrency: { name: 'Ripple', symbol: 'XRP', decimals: 18 },
  rpcUrls: ['https://root.rootnet.live/'],
  blockExplorerUrls: ['https://rootscan.io/'],
}