import { PoolState, Trade } from '@sushiswap/trident-sdk'
import { Currency, TradeType } from 'sushiswap-sdk-nervos'
import { Trade as LegacyTrade } from 'sushiswap-sdk-nervos/dist/entities/Trade'

export type TradeUnion =
  | Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT>
  | LegacyTrade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT>

export type PoolWithStateExists<T> = {
  state: PoolState.EXISTS
  pool: T
}

export type PoolWithStateLoading = {
  state: PoolState.LOADING
  pool?: undefined
}

export type PoolWithStateNotExists = {
  state: PoolState.NOT_EXISTS
  pool?: undefined
}

export type PoolWithStateInvalid = {
  state: PoolState.INVALID
  pool?: undefined
}

export type PoolWithState<T> =
  | PoolWithStateExists<T>
  | PoolWithStateLoading
  | PoolWithStateNotExists
  | PoolWithStateInvalid
