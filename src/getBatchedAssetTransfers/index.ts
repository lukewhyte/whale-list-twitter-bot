import { Logger } from 'winston';
import { Alchemy, AssetTransfersParams, AssetTransfersResponse, AssetTransfersResult } from "alchemy-sdk";

interface BatchedAssetTransfersParams {
  alchemy: Alchemy
  assetTransfers: AssetTransfersResult[]
  transferParams: AssetTransfersParams
  isFirst: boolean
  logger: Logger
  ref?: string
}

const getBatchedAssetTransfers = async (params: BatchedAssetTransfersParams) => {
  const {
    alchemy,
    assetTransfers,
    transferParams,
    isFirst,
    logger
  } = params
  const ref = params.ref ? params.ref : 'Batched asset transfer request'
  const pageKeyRef = isFirst ? 'first' : transferParams.pageKey
  
  logger.info(`${ref} - ${pageKeyRef}`)

  try {
    const res: AssetTransfersResponse = await alchemy.core.getAssetTransfers(transferParams)

    if (res.pageKey) {
      const params = {
        alchemy,
        logger,
        ref,
        assetTransfers: assetTransfers.concat(res.transfers),
        transferParams: { ...transferParams, pageKey: res.pageKey },
        isFirst: false,
      }
      return await getBatchedAssetTransfers(params)
    }

    logger.info(`${ref} - complete`)
    return assetTransfers.concat(res.transfers)
  } catch(err) {
    logger.error(err)
    return assetTransfers
  }
}

export default getBatchedAssetTransfers
