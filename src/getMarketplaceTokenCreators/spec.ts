import * as test from 'tape';
import { AssetTransfersResult } from 'alchemy-sdk'
import { buildTokenHash } from '.';
import * as stubbedAssetTransfers from './stubbedAssetTransfers.json'

test('buildTokenHash should return a hash with token as key and creator as value', async t => {
  const NORMAN_HARMAN_ADDRESS = '0x69f80347143f81267d291e62f8e5d0edbc32b1ab'
  const XCOPY_ADDRESS = '0x39cc9c86e67baf2129b80fe3414c397492ea8026'

  const result = buildTokenHash(stubbedAssetTransfers.transfers as AssetTransfersResult[])
  
  let expected: number | string = 200
  t.equal(Object.keys(result).length, expected)
  
  expected = result['0x41a322b28d0ff354040e2cbc676f0320d8c8850d:6']
  t.equal(XCOPY_ADDRESS, expected)

  expected = result['0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0:4482']
  t.equal(NORMAN_HARMAN_ADDRESS, expected)

  t.end()
})
