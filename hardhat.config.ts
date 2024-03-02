import '@nomiclabs/hardhat-ethers'
import 'dotenv/config'
import 'hardhat-deploy'
import { HardhatUserConfig } from 'hardhat/config'
import { resolve } from 'path'

const ensContractsPath = './node_modules/@ensdomains/ens-contracts'

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.24',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  // abiExporter:{} // TODO: Check rns-contracts repo - jen
  defaultNetwork: 'localhost',
  networks: {
    hardhat: {
      saveDeployments: false,
      // chainId: 7672, // porcini
      tags: ['test', 'legacy', 'use_root'],
      allowUnlimitedContractSize: false,
    },
    localhost: {
      saveDeployments: false,
      url: 'http://127.0.0.1:8545',
      // chainId: 7672,
      tags: ['test', 'legacy', 'use_root'],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    owner: {
      default: 1,
    },
  },
  external: {
    contracts: [
      {
        artifacts: [
          resolve(ensContractsPath, './deployments/archive'),
        ],
      },
    ],
  },
}

export default config
