import { http, createConfig } from '@wagmi/core'
import { injected, walletConnect, coinbaseWallet } from '@wagmi/connectors'
import { root } from './root'
import { porcini } from './porcini'

// TODO: Create an official RNS project in WalletConnect
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ""

export const config = createConfig({
    chains: [porcini, root],
    connectors: [
        injected({
            shimDisconnect: true,
            target: "metaMask"
        }),
        walletConnect({
            projectId,
            qrModalOptions: {
                explorerExcludedWalletIds: "ALL",
                explorerRecommendedWalletIds: [
                    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
                    "a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393",
                    "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",
                    "19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927",
                    "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369"
                ],
            }
        }),
        coinbaseWallet({
            appName: 'Root Name Services',
            darkMode: true,
        }),
    ],
    transports: {
        [porcini.id]: http(),
        [root.id]: http()
    },
    ssr: true
})