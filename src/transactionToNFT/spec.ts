import * as test from 'tape';
import * as dotenv from 'dotenv';
import createLogger from '../logger';
import { Alchemy, GetTransfersForOwnerTransferType, Network, NftTokenType, toHex } from 'alchemy-sdk'
import transactionToNFT, { findNFTsFromTransaction, getCreatorsContractTransfers, getTokenType } from '.';

dotenv.config();

const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

test('getTokenType should return NftTokenType type', async t => {
  const erc721Result = await getTokenType(stubbedNFTTransaction, alchemy, createLogger())
  let expected: NftTokenType | boolean = NftTokenType.ERC721
  t.equal(erc721Result, expected)

  const erc1155Result = await getTokenType(Object.assign({}, stubbedNFTTransaction, { to: '0x5C6e2892Ed14bD178F0928AbCe94C1373B8265eB' }), alchemy, createLogger())
  expected = NftTokenType.ERC1155
  t.equal(erc1155Result, expected)

  const notNFTResult = await getTokenType(Object.assign({}, stubbedNFTTransaction, { to: '0xba5BDe662c17e2aDFF1075610382B9B691296350' }), alchemy, createLogger())
  expected = NftTokenType.NO_SUPPORTED_NFT_STANDARD
  t.equal(notNFTResult, expected)

  const notContractResult = await getTokenType(Object.assign({}, stubbedNFTTransaction, { to: '0xb60d5D92FAC5CfBdb821caE5f858D1d4Ce0A97aF' }), alchemy, createLogger())
  expected = NftTokenType.NOT_A_CONTRACT
  t.equal(notContractResult, NftTokenType.NOT_A_CONTRACT)

  t.end()
})

test('getCreatorsContractTransfers should return list of NFT transfers for creator on specified contract', async t => {
  const { to } = stubbedNFTTransaction
  const result = await getCreatorsContractTransfers(stubbedCreator, to, NftTokenType.ERC721, alchemy, createLogger())
  
  const expected = 'High-Rise'
  t.equal(result[0].name, expected)

  t.end()
})

test('findNFTsFromTransaction should return list of NFT transfers minted by creator in provided transaction', async t => {
  const stubbedClone = Object.assign({}, stubbedNFTTransaction)
  const unlikelyToSell = Object.assign(stubbedClone, {
    blockNumber: '0xcf9aa1',
    to: '0xD38E7c7236EE8edDCDb2A3aF812de1eFa7968E79',
  })
  const { to } = unlikelyToSell
  const unlikelyToSellCreator = '0x29ddEaA6071a31F80aa37abd346F42C6cD685610'
  const nfts = await getCreatorsContractTransfers(unlikelyToSellCreator, to, NftTokenType.ERC721, alchemy, createLogger())
  const result = await findNFTsFromTransaction(nfts, unlikelyToSell, unlikelyToSellCreator, to, alchemy, createLogger())

  let expected: string | number = 1
  t.equal(result.length, expected)

  expected = '2'
  t.equal(result[0].tokenId, expected)

  t.end()
})

const stubbedCreator = '0xd86057c793bDFb77BB11dCAbfe054eE4fd86EbdD'

const stubbedNFTTransaction = {
  blockHash: '0xb8f0a66bd1a6e9cd8e9412099537c6cbded2fbac0fccfcc6babe1db0adb05103',
  blockNumber: '0x1209c64',
  from: '0x0000000000000000000000000000000000000000',
  gas: '0x18fbb',
  gasPrice: '0x041f2f5878',
  maxFeePerGas: '0x06059bca55',
  maxPriorityFeePerGas: '0x05f5e100',
  hash: '0x24cdf83218c0179b3f979459325bc41622c0557e43a9e304e47bf4db52b6e8e7',
  input: '0xd9856c210000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000005868747470733a2f2f697066732e7069787572612e696f2f697066732f516d50387154614676756f3374424b48615475546b3762527372524532564148744c6831457556555a6e744d4e332f6d657461646174612e6a736f6e0000000000000000',
  nonce: '0x100',
  to: '0xb7245B453bC4ACe419D64e7CeBf65C4eeC2dbd1B',
  transactionIndex: '0x7d',
  value: '0x0',
  type: '0x2',
  accessList: [],
  chainId: '0x1',
  v: '0x0',
  r: '0x7d6e880634ce926108bebaca8db76d68ba55c3f23784571e8f35495acd15a5f4',
  s: '0x24d843858582da5229769572babfdc5fb87bf01c945deaa767d32f53373f643d',
  yParity: '0x0'
}
