import * as test from 'tape';
import * as dotenv from 'dotenv';
import createLogger from '../logger';
import { Alchemy, Network, AssetTransfersCategory } from 'alchemy-sdk'
import { SUPERRARE_V1, ZERO_ADDRESS } from '../constants';
import getBatchedAssetTransfers from '.';

dotenv.config();

const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

test('getBatchedAssetTransfers should handle the "1000 transfers per request" Alchemy limit thru batching', async t => {
  const transferParams = {
    fromAddress: ZERO_ADDRESS,
    excludeZeroValue: true,
    contractAddresses: [SUPERRARE_V1],
    category: [AssetTransfersCategory.ERC20],
  }

  const params = {
    alchemy,
    assetTransfers: [],
    transferParams: transferParams,
    isFirst: true,
    logger: createLogger(),
    ref: 'Testing batched asset transfers',
  }

  const result = await getBatchedAssetTransfers(params)
  
  let expected = 4436
  t.equal(result.length, expected)
  
  expected = result[4]
  t.deepEqual(firstXCOPY, expected)

  t.end()
})

const firstXCOPY = {
  blockNum: '0x5262ca',
  uniqueId: '0xb33c6539cf7234aa4c1a08a6b16ccdef31aa78fef7769a31440fd811880578f1:log:103',
  hash: '0xb33c6539cf7234aa4c1a08a6b16ccdef31aa78fef7769a31440fd811880578f1',
  from: '0x0000000000000000000000000000000000000000',
  to: '0x39cc9c86e67baf2129b80fe3414c397492ea8026',
  value: null,
  erc721TokenId: null,
  erc1155Metadata: null,
  tokenId: null,
  asset: 'SUPR',
  category: 'erc20',
  rawContract: {
    value: '0x05',
    address: '0x41a322b28d0ff354040e2cbc676f0320d8c8850d',
    decimal: null
  }
}
