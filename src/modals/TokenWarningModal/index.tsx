import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import React, { FC } from 'react'
import { Token } from 'sushiswap-sdk-nervos'

import { ImportToken } from '../SearchModal/ImportToken'

interface TokenWarningModal {
  isOpen: boolean
  tokens: Token[]
  onConfirm: () => void
}

const TokenWarningModal: FC<TokenWarningModal> = ({ isOpen, tokens, onConfirm }) => {
  return (
    <HeadlessUiModal.Controlled isOpen={isOpen} onDismiss={onConfirm}>
      <ImportToken tokens={tokens} />
    </HeadlessUiModal.Controlled>
  )
}

export default TokenWarningModal
