import { http, createConfig } from 'wagmi'
import { base, mainnet, } from 'wagmi/chains'
import { injected, safe, walletConnect } from 'wagmi/connectors'

// TODO: Create an official RNS project in WalletConnect
const projectId = '1eb80f5c8feab7837860b4c8588d1171'

export const config = createConfig({
    chains: [mainnet, base],
    connectors: [
        injected(),
        walletConnect({ projectId }),
        safe(),
    ],
    transports: {
        [mainnet.id]: http(),
        [base.id]: http(),
    },
})

