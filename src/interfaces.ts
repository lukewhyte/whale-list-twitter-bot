import { Alchemy, AssetTransfersParams, AssetTransfersResult } from "alchemy-sdk"
import { Logger } from "winston"

export interface BatchedAssetTransfersParams {
  alchemy: Alchemy
  assetTransfers: AssetTransfersResult[]
  transferParams: AssetTransfersParams
  isFirst: boolean
  logger: Logger
  ref?: string
}

export interface TokenCreators {
  [key: string]: string
}

export interface Transaction {
  blockHash: string
  blockNumber: string
  from: string
  gas: string
  gasPrice: string
  maxFeePerGas: string
  maxPriorityFeePerGas: string
  hash: string
  input: string
  nonce: string
  to: string
  transactionIndex: string
  value: string
  type: string
  accessList: string[]
  chainId: string
  v: string
  r: string
  s: string
  yParity: string
}

export interface TransactionResponse {
  removed: boolean
  transaction: Transaction
}

export interface IsNotNFT {
  isNFT: false
}

export interface NFT {
  creator: string
  name: string
  description: string
  tokenUri: string
  contract: string
}

export interface IsNFT {
  isNFT: true
  nfts: NFT[]
}

export type NFTResult = IsNotNFT | IsNFT
