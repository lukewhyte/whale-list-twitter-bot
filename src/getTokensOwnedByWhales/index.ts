import { Alchemy, AssetTransfersCategory, AssetTransfersResult, fromHex } from "alchemy-sdk"
import { Logger } from "winston"
import { SUPERRARE_V1, SUPERRARE_V2, ZERO_ADDRESS } from "../constants"
import getBatchedAssetTransfers from "../getBatchedAssetTransfers"

const buildAssetTransferParams = (
  address: string,
  contract: string,
  category: AssetTransfersCategory,
  ref: string,
  alchemy: Alchemy,
  logger: Logger
) => ({
  alchemy,
  logger,
  assetTransfers: [],
  transferParams: {
    category: [category],
    toAddress: address,
    excludeZeroValue: true,
    contractAddresses: [contract],
  },
  isFirst: true,
  ref: `${ref}: ${address}`
})

const getTokensOwnedByWhales = async (whales: string[], alchemy: Alchemy, logger: Logger) => {
  const srV1Transfers = await Promise.all(whales.map((address: string) => {
    return getBatchedAssetTransfers(buildAssetTransferParams(
      address,
      SUPERRARE_V1,
      AssetTransfersCategory.ERC20,
      'SuperRare v1 whale transfers',
      alchemy,
      logger
    ))
  }))
  .then((res: Array<AssetTransfersResult[]>) => res.flat())
  .catch(err => {
    logger.error(err)
    return []
  })

  const srV2Transfers = await Promise.all(whales.map((address: string) => {
    return getBatchedAssetTransfers(buildAssetTransferParams(
      address,
      SUPERRARE_V2,
      AssetTransfersCategory.ERC721,
      'SuperRare v2 whale transfers',
      alchemy,
      logger
    ))
  }))
  .then((res: Array<AssetTransfersResult[]>) => res.flat())
  .catch(err => {
    logger.error(err)
    return []
  })

  const tokens = srV1Transfers.concat(srV2Transfers).reduce((
    tokens: Set<string>,
    transfer: AssetTransfersResult
  ) => {
    if (transfer.from !== ZERO_ADDRESS) {
      const tokenId = transfer.erc721TokenId ? fromHex(transfer.erc721TokenId) : fromHex(transfer.rawContract.value)
      tokens.add(`${transfer.rawContract.address}:${tokenId}`)
    }
    return tokens
  }, new Set())

  return Array.from(tokens) as string[]
}

export default getTokensOwnedByWhales
