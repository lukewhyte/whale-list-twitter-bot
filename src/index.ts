#!/usr/bin/env node
import * as dotenv from 'dotenv';
import createLogger from './logger';
import { Logger } from 'winston';
import { Alchemy, Network } from 'alchemy-sdk'
import getMarketplaceTokenCreators from './getMarketplaceTokenCreators';
import getWhales from './getWhales';
import getTokensOwnedByWhales from './getTokensOwnedByWhales';
import getWhalesList from './getWhalesList';
import listenForMints from './listenForMints';
import postToTwitter from './postToTwitter';
import transactionToNFT from './transactionToNFT';

dotenv.config();

const launchBot = async () => {
  const logger: Logger = createLogger();

  const config = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
  };
  const alchemy = new Alchemy(config);

  const tokenCreators = await getMarketplaceTokenCreators(alchemy, logger)
  const whaleTokens = await getTokensOwnedByWhales(getWhales(), alchemy, logger)
  const whaleListOfCreators = getWhalesList(tokenCreators, whaleTokens)

  listenForMints(whaleListOfCreators, async (txn) => {
    const nftResult = await transactionToNFT(txn, alchemy, logger)
    postToTwitter(nftResult)
  }, alchemy)
}

launchBot()
