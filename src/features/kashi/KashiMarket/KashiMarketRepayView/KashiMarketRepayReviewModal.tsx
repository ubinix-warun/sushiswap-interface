import { Signature } from '@ethersproject/bytes'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import { HeadlessUiModal } from 'app/components/Modal'
import SubmittedModalContent from 'app/components/Modal/SubmittedModalContent'
import Typography from 'app/components/Typography'
import { KashiMarketDetailsView, useKashiMarket, useRepayExecute } from 'app/features/kashi/KashiMarket'
import { unwrappedToken } from 'app/functions'
import React, { FC, useCallback, useState } from 'react'
import { CurrencyAmount } from 'sushiswap-sdk-nervos'

import { KashiMarketRepayButtonProps } from './KashiMarketRepayButton'

interface KashiMarketRepayReviewModal extends KashiMarketRepayButtonProps {
  open: boolean
  onDismiss(): void
  permit?: Signature
}

export const KashiMarketRepayReviewModal: FC<KashiMarketRepayReviewModal> = ({
  trade,
  repayFromWallet,
  removeToWallet,
  repayAmount,
  removeAmount,
  closePosition,
  open,
  onDismiss,
  view,
  removeMax,
  repayMax,
}) => {
  const { i18n } = useLingui()
  const { market } = useKashiMarket()
  const [txHash, setTxHash] = useState<string>()
  const [attemptingTxn, setAttemptingTxn] = useState(false)
  const execute = useRepayExecute()

  const repayAmountCurrencyAmount = CurrencyAmount.fromRawAmount(
    unwrappedToken(market.asset.token),
    market.currentUserBorrowAmount
  )
  const removeAmountCurrencyAmount = CurrencyAmount.fromRawAmount(
    unwrappedToken(market.collateral.token),
    market.userCollateralAmount
  )

  const _execute = useCallback(async () => {
    setAttemptingTxn(true)

    try {
      const tx = await execute({
        trade,
        repayFromWallet,
        repayAmount,
        closePosition,
        removeToWallet,
        removeAmount,
        removeMax,
        repayMax,
      })

      if (tx?.hash) {
        setTxHash(tx.hash)
      }
    } finally {
      setAttemptingTxn(false)
    }
  }, [closePosition, execute, removeAmount, removeToWallet, repayAmount, repayFromWallet, trade])

  return (
    <HeadlessUiModal.Controlled
      isOpen={open}
      onDismiss={onDismiss}
      maxWidth="md"
      afterLeave={() => setTxHash(undefined)}
    >
      {!txHash ? (
        <div className="flex flex-col gap-4">
          <HeadlessUiModal.Header
            header={closePosition ? i18n._(t`Close Position`) : i18n._(t`Confirm Repay`)}
            onClose={onDismiss}
          />
          {closePosition ? (
            <>
              <Typography variant="sm">
                {i18n._(
                  t`You will be closing this position by swapping your collateral for your borrowed debt. Any collateral remainder will be sent to your ${
                    removeToWallet ? 'wallet' : 'BentoBox'
                  }`
                )}
              </Typography>
              <HeadlessUiModal.BorderedContent className="flex flex-col gap-4 bg-dark-1000/40 !border-dark-700">
                <div className="flex flex-col gap-2">
                  <Typography variant="xs" className="text-secondary">
                    {i18n._(t`Collateral that will be swapped`)}
                  </Typography>
                  <div className="inline-flex gap-2">
                    <CurrencyLogo currency={market.collateral.token} size={20} />
                    <Typography weight={700} component="span" className="text-high-emphesis">
                      {trade?.inputAmount?.toSignificant(6)}
                      <Typography weight={700} className="text-low-emphesis" component="span">
                        {' '}
                        / {removeAmountCurrencyAmount.toSignificant(6)} {trade?.inputAmount.currency.symbol}
                      </Typography>{' '}
                    </Typography>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Typography variant="xs" className="text-secondary">
                    {i18n._(t`To repay borrowed tokens`)}
                  </Typography>
                  <div className="inline-flex gap-2">
                    <CurrencyLogo currency={market.asset.token} size={20} />
                    <Typography weight={700} component="span" className="text-high-emphesis">
                      {repayAmountCurrencyAmount?.toSignificant(6)}{' '}
                      <Typography weight={700} className="text-low-emphesis" component="span">
                        {repayAmountCurrencyAmount.currency.symbol}
                      </Typography>
                    </Typography>
                  </div>
                </div>
              </HeadlessUiModal.BorderedContent>
            </>
          ) : (
            <>
              <Typography variant="sm">{i18n._(t`You will be reducing this position by`)}</Typography>
              <HeadlessUiModal.BorderedContent className="flex flex-col gap-4 bg-dark-1000/40 !border-dark-700">
                <div className="flex flex-col gap-2">
                  <Typography variant="xs" className="text-secondary">
                    {i18n._(t`And removing`)}
                  </Typography>
                  <div className="inline-flex items-center gap-2">
                    <CurrencyLogo currency={market.collateral.token} size={20} />
                    <b>
                      {removeAmount?.greaterThan(0) ? removeAmount?.toSignificant(6) : '0'}{' '}
                      {removeAmount?.currency.symbol}
                    </b>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Typography variant="xs" className="text-secondary">
                    {i18n._(t`Repaying`)}
                  </Typography>
                  <div className="inline-flex items-center gap-2">
                    <CurrencyLogo currency={market.asset.token} size={20} />
                    <b>
                      {repayAmount?.greaterThan(0) ? repayAmount?.toSignificant(6) : '0'} {repayAmount?.currency.symbol}
                    </b>
                  </div>
                </div>
              </HeadlessUiModal.BorderedContent>
            </>
          )}
          <KashiMarketDetailsView
            view={view}
            collateralAmount={closePosition ? removeAmountCurrencyAmount : removeAmount}
            borrowAmount={closePosition ? repayAmountCurrencyAmount : repayAmount}
          />
          <Button loading={attemptingTxn} color="gradient" disabled={attemptingTxn} onClick={_execute}>
            {closePosition ? i18n._(t`Close Position`) : i18n._(t`Confirm Repay`)}
          </Button>
        </div>
      ) : (
        <SubmittedModalContent
          header={i18n._(t`Success!`)}
          subheader={i18n._(t`Success! Repay Submitted`)}
          txHash={txHash}
          onDismiss={onDismiss}
        />
      )}
    </HeadlessUiModal.Controlled>
  )
}
