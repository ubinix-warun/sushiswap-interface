import { ChainId, Token } from 'sushiswap-sdk-nervos'

export const DAI = new Token(
  ChainId.NERVOS_TESTNET,
  '0x21cDE7E32a6CAF4742d00d44B07279e7596d26B9',
  18,
  'DAI',
  'Dai Stablecoin'
)
export const USDC = new Token(
  ChainId.NERVOS_TESTNET,
  '0xc946DAf81b08146B1C7A8Da2A851Ddf2B3EAaf85',
  18,
  'USDC',
  'USD Coin'
)
