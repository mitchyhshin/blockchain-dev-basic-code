import { HardhatUserConfig } from 'hardhat/types';
import '@nomiclabs/hardhat-waffle';
import 'hardhat-typechain';
import 'dotenv/config';

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.17',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      accounts: {
        count: 10,
      },
    },
    baobab: {
      url: 'https://klaytn-baobab.blockpi.network/v1/rpc/public',
      accounts: [process.env.PRIVATE_KEY || ''],
      chainId: 1001,
    },
  },
  mocha: {
    timeout: 400000,
  },
};

export default config;
