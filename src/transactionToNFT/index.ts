import { Alchemy, GetTransfersForOwnerTransferType, NftTokenType, TransferredNft } from "alchemy-sdk";
import { NFTResult, Transaction } from "../interfaces";
import { ZERO_ADDRESS } from "../constants";
import { Logger } from "winston";

const isTokenMint = (from: string) => from === ZERO_ADDRESS

const transferIsSameBlockAsTransaction = (nft: TransferredNft, transaction: Transaction) => {
  return nft.blockNumber === transaction.blockNumber
}

export const getTokenType = async (transaction: Transaction, alchemy: Alchemy, logger: Logger) => {
  try {
    const { tokenType } = await alchemy.nft.getContractMetadata(transaction.to)
    return tokenType
  } catch(err) {
    logger.error(err)
    return NftTokenType.UNKNOWN
  }
}

export const getCreatorsContractTransfers = async (
  creator: string,
  contract: string,
  tokenType: NftTokenType.ERC1155 | NftTokenType.ERC721,
  alchemy: Alchemy,
  logger: Logger
) => {
  try {
    const { nfts } = await alchemy.nft.getTransfersForOwner(
      creator,
      GetTransfersForOwnerTransferType.TO,
      {
        contractAddresses: [contract],
        tokenType,
      }
    )
    return nfts
  } catch(err) {
    logger.error(err)
    return []
  }
}

export const findNFTsFromTransaction = async (
  nfts: TransferredNft[],
  transaction: Transaction,
  creator: string,
  contract: string,
  alchemy: Alchemy,
  logger: Logger
) => {
  try {
    const matchingMints = []
    for (let i = 0; i < nfts.length; i++) {
      const nft = nfts[i]
      if (isTokenMint(nft.from) && transferIsSameBlockAsTransaction(nft, transaction)) {
        const { owners } = await alchemy.nft.getOwnersForNft(contract, nft.tokenId)
        const creatorIsowner = !!owners.find((owner: string) => owner === creator)
        if (creatorIsowner) {
          matchingMints.push(nft)
        }
      }
    }
    return matchingMints
  } catch(err) {
    logger.error(err)
    return []
  }
}

const transactionToNFT = async (transaction: Transaction, alchemy: Alchemy, logger: Logger): Promise<NFTResult> => {
  console.log(transaction)
  try {
    const tokenType = await getTokenType(transaction, alchemy, logger)

    if (tokenType !== NftTokenType.ERC721 && tokenType !== NftTokenType.ERC1155) {
      return { isNFT: false }
    }

    const contract = transaction.to
    const creator = transaction.from

    const nfts = await getCreatorsContractTransfers(creator, contract, tokenType, alchemy, logger)

    const matchingMints = await findNFTsFromTransaction(nfts, transaction, creator, contract, alchemy, logger)

    if (matchingMints.length === 0) {
      return { isNFT: false }
    }

    return {
      isNFT: true,
      nfts: matchingMints.map((nft: TransferredNft) => ({
        creator,
        contract,
        name: nft.name ? nft.name : 'We failed you: No name found',
        description: nft.description ? nft.description : 'We failed you: No description found',
        tokenUri: nft.tokenUri,
      })),
    }
  } catch(err) {
    logger.error(err)
    return { isNFT: false }
  }
}

export default transactionToNFT
