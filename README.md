# Art Collector Whale List Twitter bot

## What is this?

Here's a top level overview:

1. We use [this Dune query](https://dune.com/queries/3331967/5582143) to identify the top 100 collectors on SuperRare (will add Foundation soon).
2. We then utilize the [Alchemy SDK](https://docs.alchemy.com/reference/alchemy-sdk-quickstart) to retrieve the Ethereum address of every artist this group of collectors has ever collected an artwork from on SuperRare (again, adding Foundation soon).
3. We then setup Alchemy websocket listeners to listen for whenever any of those artists makes any type of onchain transaction.
4. Again using the Alchemy SDK, we investigate those transactions. If they prove to be recording the minting of a new NFT – on any contract, not just on SR – we extract the artwork metadata from the work to post on Twitter
5. Finally, (and this last step is still in development), we'll use the Twitter API to post the freshly minted artwork to Twitter where anyone can find and check it out.

## What's the structure of the codebase?

The project is written using Node & Typescript, with all modules located in `/src`. Each module has its own directory with two files:

- `index.ts`: The module.
- `spec.ts`: The test file written using [Tape](https://www.npmjs.com/package/tape).

Let's walk through the execution process:

1. We pull the list of collectors from [getWhales](src/getWhales/). For now, the collector list is static, but I'd like to refresh it via polling in the near future.
2. Utilizing [getMarketplace](src/getMarketplace/), we grab a list of every token ever minted on SuperRare across both contracts: `tokenCreators`.
3. Via [getTokensOwnedByWhales](src/getTokensOwnedByWhales/), we then pull a list of every SuperRare token this group of collectors has ever owned. We exclude tokens they minted themselves, but include all transfers, whether purchased or gifted: `whaleTokens`.
4. We then filter `tokenCreators` against `whaleTokens` to produce a list of every artist ever collected by one or more of our 100 SR whale collectors.
5. At this point, we use [listenForMints](src/listenForMints/) to set up the websockets that listen for any Ethereum transactions initiated _from_ one of these artists' addresses
6. These transactions are passed to [transactionToNFT](src/transactionToNFT/) to decipher if the transaction reflects the minting of an ERC721 or ERC1155 token on any contract. If the transaction `to` address is, in fact, a NFT contract, and the token transfer address is the zero address (`0x0000000000000000000000000000000000000000`), we can infer that this is a freshly minted token by the artist.
7. These freshly minted tokens are then passed to [postToTwitter](src/postToTwitter/), which (tbd) will post the artwork image and other metadata to our (yet to be created) Twitter bot account.
