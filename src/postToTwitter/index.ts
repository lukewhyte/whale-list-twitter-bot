import { NFTResult } from "../interfaces"

const postToTwitter = async (nftResult: NFTResult) => {
  console.log(`isNFT: ${nftResult.isNFT}`)
  if (nftResult.isNFT) {
    console.log(nftResult.nfts)
  }
}

export default postToTwitter
