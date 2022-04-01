import { Currency, CurrencyAmount } from 'sushiswap-sdk-nervos'

export interface Assets {
  asset: CurrencyAmount<Currency>
  strategy?: { token: string; apy: number; targetPercentage: number; utilization: number }
}
