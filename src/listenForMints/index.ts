import { Alchemy, AlchemyMinedTransactionsAddress, AlchemySubscription, NonEmptyArray, TransfersNftResponse } from "alchemy-sdk";
import { Transaction, TransactionResponse } from "../interfaces";
import { ZERO_ADDRESS } from "../constants";

const formatAddress = (address: string): AlchemyMinedTransactionsAddress => ({
  from: address,
})

// splitAddressIntoBlocks is necessary b/c Alchemy webhooks support a max of 1000 addresses
// per listener
export const splitAddressIntoBlocks = (creators: string[]): NonEmptyArray<AlchemyMinedTransactionsAddress>[] => {
  const blocks = []
  const maxPerListener = 1000
  let pointer = 0
  while(pointer < creators.length) {
    blocks.push(creators.slice(pointer, pointer + maxPerListener).map(formatAddress))
    pointer += maxPerListener
  }
  return blocks
}

const listenForMints = (
  creators: string[],
  handleMintEvent: (transaction: Transaction) => Promise<void>,
  alchemy: Alchemy,
) => {
  const addressArr = splitAddressIntoBlocks(creators)

  addressArr.forEach((addresses: NonEmptyArray<AlchemyMinedTransactionsAddress>) => {
    if (addresses.length !== 0) {
      const events = {
        method: AlchemySubscription.MINED_TRANSACTIONS,
        addresses,
        topics: [null, ZERO_ADDRESS],
      }

      alchemy.ws.on(events, (res: TransactionResponse) => handleMintEvent(res.transaction))
    }
  })
}

export default listenForMints
