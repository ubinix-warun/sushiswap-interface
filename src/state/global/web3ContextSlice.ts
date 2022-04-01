import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { AppState } from 'app/state'
import { ChainId } from 'sushiswap-sdk-nervos'

export interface Web3ReactContext {
  chainId?: ChainId
  account?: Web3ReactContextInterface['account']
}

const initialState: Web3ReactContext = {}

export const web3ContextSlice = createSlice({
  name: 'web3Context',
  initialState,
  reducers: {
    updateWeb3Context: (state, action: PayloadAction<Web3ReactContext>) => {
      return action.payload
    },
  },
})

export const { updateWeb3Context } = web3ContextSlice.actions

export const selectWeb3Context = (state: AppState) => state.web3Context

export default web3ContextSlice.reducer
