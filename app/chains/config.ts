import { http, createConfig } from 'wagmi'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'
import { createPublicClient } from 'viem'
import { root } from './root'
import { porcini } from './porcini'

// TODO: Create an official RNS project in WalletConnect
// TODO: Move this to .env
const projectId = '1eb80f5c8feab7837860b4c8588d1171'

export const config = createConfig({
    chains: [porcini],
    connectors: [
        injected({
            shimDisconnect: true,
            // target: 'metaMask'
        }),
        walletConnect({ projectId }),
        coinbaseWallet({
            appName: 'Root Name Services',
        }),
    ],
    transports: {
        // [mainnet.id]: http(),
        [porcini.id]: http()
    },
})

export const publicClient = createPublicClient({
    chain: porcini,
    transport: http(),
});