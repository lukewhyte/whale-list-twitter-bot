import { Logger } from 'winston';
import { Alchemy, AssetTransfersCategory, AssetTransfersResult, fromHex } from 'alchemy-sdk'
import { SUPERRARE_V1, SUPERRARE_V2, ZERO_ADDRESS } from '../constants'
import getBatchedAssetTransfers from '../getBatchedAssetTransfers'
import { TokenCreators } from '../interfaces';

interface Tokens {
  [key: string]: string
}

const SR_V1_PARAMS = {
  fromAddress: ZERO_ADDRESS,
  excludeZeroValue: true,
  contractAddresses: [SUPERRARE_V1],
  category: [AssetTransfersCategory.ERC20],
}

const SR_V2_PARAMS = {
  fromAddress: ZERO_ADDRESS,
  excludeZeroValue: true,
  contractAddresses: [SUPERRARE_V2],
  category: [AssetTransfersCategory.ERC721],
}

const getTokenFromHash = (mint: AssetTransfersResult) => {
  if (mint.erc721TokenId) {
    return `${mint.rawContract.address}:${fromHex(mint.erc721TokenId)}`
  }

  return `${mint.rawContract.address}:${fromHex(mint.rawContract.value)}`
}

export const buildTokenHash = (mints: AssetTransfersResult[]): TokenCreators => mints.reduce((
  tokens: Tokens,
  mint: AssetTransfersResult
) => {
  tokens[getTokenFromHash(mint)] = mint.to
  return tokens
}, {})

const getMarketplaceTokenCreators = async (alchemy: Alchemy, logger: Logger) => {
  try {
    const srV1Mints = await getBatchedAssetTransfers({
      alchemy,
      logger,
      assetTransfers: [],
      transferParams: SR_V1_PARAMS,
      isFirst: true,
      ref: 'SuperRare V1 transfers'
    })

    const srV2Mints = await getBatchedAssetTransfers({
      alchemy,
      logger,
      assetTransfers: [],
      transferParams: SR_V2_PARAMS,
      isFirst: true,
      ref: 'SuperRare V2 transfers'
    })

    return buildTokenHash(srV1Mints.concat(srV2Mints))
  } catch(err) {
    logger.error(err)
    return {}
  }
}

export default getMarketplaceTokenCreators
