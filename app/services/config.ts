import { http, createConfig } from 'wagmi'
import { base, mainnet, } from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'

// TODO: Create an official RNS project in WalletConnect
const projectId = '1eb80f5c8feab7837860b4c8588d1171'

export const config = createConfig({
    chains: [mainnet, base],
    connectors: [
        injected({
            shimDisconnect: true,
            target: 'metaMask'
        }),
        walletConnect({ projectId }),
        coinbaseWallet({
            appName: 'Root Name Services',
        }),
    ],
    transports: {
        [mainnet.id]: http(),
        [base.id]: http(),
    },
})

