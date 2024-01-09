import { TokenCreators } from "../interfaces"

const getWhalesList = (tokenCreators: TokenCreators, whaleTokens: string[]) => {
  const creatorSet: Set<string> = new Set()
  whaleTokens.forEach((token: string) => {
    if (tokenCreators[token]) {
      creatorSet.add(tokenCreators[token])
    }
  })
  return Array.from(creatorSet)
}

export default getWhalesList
