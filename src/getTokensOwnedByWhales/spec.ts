import * as test from 'tape';
import * as dotenv from 'dotenv';
import createLogger from '../logger';
import { Alchemy, Network } from 'alchemy-sdk'
import getTokensOwnedByWhales from '.';

dotenv.config();

const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

test('getTokensOwnedByWhales should return an array of all tokens owned at anytime by the list of whales', async t => {
  const whales = [
    '0x54a973a5da508d551edf9ee50842e7c36faa1d87',
    '0xce90a7949bb78892f159f428d0dc23a8e3584d75',
    '0xf5c27c6fe782cbb5c85989ea3e75754748153459',
  ]

  const result = await getTokensOwnedByWhales(whales, alchemy, createLogger())

  let expected: number | string = 119
  t.equal(result.length, expected)
  
  expected = result[0]
  t.equal('0x41a322b28d0ff354040e2cbc676f0320d8c8850d:4132', expected)

  expected = result.find((token: string) => token === '0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0:16797')
  t.equal('0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0:16797', expected)

  t.end()
})
