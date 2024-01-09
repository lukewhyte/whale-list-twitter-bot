import * as test from 'tape';
import { splitAddressIntoBlocks } from '.';

test('splitAddressesIntoBlocks should return AlchemyMinedTransactionsAddress[][] split according to websocket limits', t => {
  const creators = Array(2399).fill('0x').map((hex: string, idx: number) => `${hex}${idx}`)

  const result = splitAddressIntoBlocks(creators)

  let expected: string | number = 3
  t.equal(result.length, expected)

  expected = '0x447'
  t.equal(result[0][447].from, expected)

  expected = '0x1999'
  t.equal(result[1][999].from, expected)

  expected = '0x2000'
  t.equal(result[2][0].from, expected)

  t.end()
})