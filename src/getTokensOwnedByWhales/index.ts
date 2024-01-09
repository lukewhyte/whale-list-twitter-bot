import { Alchemy, AssetTransfersCategory, AssetTransfersParams, AssetTransfersResult, fromHex } from "alchemy-sdk"
import { Logger } from "winston"
import { SUPERRARE_V1, SUPERRARE_V2, ZERO_ADDRESS } from "../constants"
import getBatchedAssetTransfers from "../getBatchedAssetTransfers"
import { BatchedAssetTransfersParams } from "../interfaces"

const buildAssetTransferParams = (
  address: string,
  contract: string,
  category: AssetTransfersCategory,
  ref: string,
  alchemy: Alchemy,
  logger: Logger
): BatchedAssetTransfersParams => ({
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

// This is necessary b/c use of Promise.all makes the Alchemy API grumpy (at least on free tier)
const makeRequestsSynchronously = async (
  whales: string[],
  contract: string,
  category: AssetTransfersCategory,
  ref: string,
  alchemy: Alchemy,
  logger: Logger
) => {
  let transfers = []
  let pointer = 0
  
  while (pointer < whales.length) {
    const params = buildAssetTransferParams(whales[pointer], contract, category, ref, alchemy, logger)
    const transfersForSingleAddress = await getBatchedAssetTransfers(params)
    transfers = transfers.concat(transfersForSingleAddress)
    pointer += 1
  }

  return transfers
}

const getTokensOwnedByWhales = async (whales: string[], alchemy: Alchemy, logger: Logger) => {
  try {
    const srV1Transfers = await makeRequestsSynchronously(
      whales,
      SUPERRARE_V1,
      AssetTransfersCategory.ERC20,
      'SuperRare v1 whale transfers',
      alchemy,
      logger
    )

    const srV2Transfers = await makeRequestsSynchronously(
      whales,
      SUPERRARE_V2,
      AssetTransfersCategory.ERC721,
      'SuperRare v2 whale transfers',
      alchemy,
      logger
    )

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
  } catch(err) {
    logger.error(err)
    return []
  }
}

export default getTokensOwnedByWhales
