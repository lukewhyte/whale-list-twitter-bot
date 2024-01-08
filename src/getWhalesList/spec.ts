import * as test from 'tape';
import getWhalesList from '.';

test('getWhalesList should return a list of all creators collected by whales', async t => {
  const whaleTokens = [
    '0x41a322b28d0ff354040e2cbc676f0320d8c8850d:4132',
    '0x41a322b28d0ff354040e2cbc676f0320d8c8850d:374',
    '0x41a322b28d0ff354040e2cbc676f0320d8c8850d:1134',
    '0x41a322b28d0ff354040e2cbc676f0320d8c8850d:1845',
    '0x41a322b28d0ff354040e2cbc676f0320d8c8850d:2123',
    '0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0:29910',
    '0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0:29987',
    '0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0:30024',
    '0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0:25654',
    '0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0:30158',
    '0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0:30020',
    '0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0:30184',
  ]

  const tokenCreators = {
    '0x41a322b28d0ff354040e2cbc676f0320d8c8850d:4132': '0x1111111',
    '0x41a322b28d0ff354040e2cbc676f0320d8c8850d:4133': '0x1111112',
    '0x41a322b28d0ff354040e2cbc676f0320d8c8850d:4134': '0x1111117',
    '0x41a322b28d0ff354040e2cbc676f0320d8c8850d:4135': '0x1111118',
    '0x41a322b28d0ff354040e2cbc676f0320d8c8850d:374': '0x1111112',
    '0x41a322b28d0ff354040e2cbc676f0320d8c8850d:1134': '0x1111112',
    '0x41a322b28d0ff354040e2cbc676f0320d8c8850d:1845': '0x1111112',
    '0x41a322b28d0ff354040e2cbc676f0320d8c8850d:2123': '0x1111113',
    '0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0:29910': '0x1111113',
    '0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0:29987': '0x1111114',
    '0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0:30024': '0x1111114',
    '0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0:25654': '0x1111114',
    '0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0:30158': '0x1111114',
    '0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0:30020': '0x1111115',
    '0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0:30184': '0x1111116',
    '0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0:30185': '0x1111119',
  }

  const result = getWhalesList(tokenCreators, whaleTokens)

  let expected: number | string = 6
  t.equal(result.length, expected)
  
  expected = result[result.length - 1]
  t.equal('0x1111116', expected)

  t.end()
})
