import { CurrencyAmount, Token } from 'sushiswap-sdk-nervos'

type TokenAddress = string

export type TokenBalancesMap = Record<TokenAddress, CurrencyAmount<Token>>
