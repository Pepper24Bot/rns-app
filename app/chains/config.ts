import { http, createConfig } from '@wagmi/core'
import { porcini } from '@/chains/porcini'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'
import { createPublicClient, createWalletClient } from 'viem'

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