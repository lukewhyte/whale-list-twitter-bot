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
  const result = await getTokensOwnedByWhales(whales, alchemy, createLogger())

  let expected: number | string = 665
  t.equal(result.length, expected)
  
  expected = result[0]
  t.equal('0x41a322b28d0ff354040e2cbc676f0320d8c8850d:4132', expected)

  expected = result.find((token: string) => token === '0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0:16797')
  t.equal('0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0:16797', expected)

  t.end()
})

const whales = [
  '0x54a973a5da508d551edf9ee50842e7c36faa1d87',
  '0xce90a7949bb78892f159f428d0dc23a8e3584d75',
  '0x50664ede715e131f584d3e7eaabd7818bb20a068',
  '0x63fed38f5d6f6fd6a899451c72322c44b9c5acb0',
  '0xe8e974b98c320741adf9235c0a5702eb8e68233f',
  '0xbec69dfce4c1fa8b7843fee1ca85788d84a86b06',
  '0x2debdf4427ccbcfdbc7f29d63964499a0ec184f6',
  '0xcc6c1d21e8474b3578e69eb036c712ab08ffdfbb',
  '0xf476cd75be8fdd197ae0b466a2ec2ae44da41897',
]
