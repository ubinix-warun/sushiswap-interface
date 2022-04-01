import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyLogoArray } from 'app/components/CurrencyLogo'
import GradientDot from 'app/components/GradientDot'
import Typography from 'app/components/Typography'
import KashiMediumRiskLendingPair from 'app/features/kashi/KashiMediumRiskLendingPair'
import { TABLE_TBODY_TD_CLASSNAME, TABLE_TBODY_TR_CLASSNAME } from 'app/features/trident/constants'
import { classNames, currencyFormatter, formatNumber, formatPercent } from 'app/functions'
import { useUSDCValueWithLoadingIndicator } from 'app/hooks/useUSDCPrice'
import { useRouter } from 'next/router'
import React, { FC, memo, useMemo, useState } from 'react'
import { CurrencyAmount, Percent, Price } from 'sushiswap-sdk-nervos'

import { LTV } from './constants'

interface KashiLendingListItem {
  market: KashiMediumRiskLendingPair
}
const KashiLendingListItem: FC<KashiLendingListItem> = ({ market }) => {
  const { i18n } = useLingui()
  const router = useRouter()
  const [invert, setInvert] = useState(false)
  const asset = market.asset.token
  const collateral = market.collateral.token

  // @ts-ignore
  const userCollateralAmount = useMemo(
    () => CurrencyAmount.fromRawAmount(collateral, market.userCollateralAmount),
    [collateral, market.userCollateralAmount]
  )
  const { value: userCollateralAmountUSD, loading: userCollateralAmountUSDLoading } =
    useUSDCValueWithLoadingIndicator(userCollateralAmount)

  // @ts-ignore
  const currentUserBorrowAmount = useMemo(
    () => CurrencyAmount.fromRawAmount(asset, market.currentUserBorrowAmount),
    [asset, market.currentUserBorrowAmount]
  )
  const { value: currentUserBorrowAmountUSD, loading: currentUserBorrowAmountUSDLoading } =
    useUSDCValueWithLoadingIndicator(currentUserBorrowAmount)

  const liquidationPrice = new Price({
    baseAmount: currentUserBorrowAmount.multiply(LTV),
    quoteAmount: userCollateralAmount,
  })

  const currentInterestPerYear = new Percent(market.currentInterestPerYear, 1e18)

  const health = new Percent(market.health, 1e18)

  return (
    <div
      className={classNames(TABLE_TBODY_TR_CLASSNAME, 'grid grid-cols-6')}
      onClick={() => router.push(`/kashi/${market.address}`)}
    >
      <div className={classNames('flex gap-2', TABLE_TBODY_TD_CLASSNAME(0, 6))}>
        {asset && collateral && <CurrencyLogoArray currencies={[asset, collateral]} dense size={32} />}
        <div className="flex flex-col items-start">
          <Typography weight={700} className="flex gap-1 text-high-emphesis">
            {asset.symbol}
            <span className="text-low-emphesis">/</span>
            {collateral.symbol}
          </Typography>
          <Typography variant="xs" className="text-low-emphesis">
            {market.oracle.name}
          </Typography>
        </div>
      </div>
      <div className={classNames('flex flex-col !items-end', TABLE_TBODY_TD_CLASSNAME(1, 6))}>
        <Typography weight={700} className="text-high-emphesis">
          {formatNumber(userCollateralAmount.toSignificant(6))} {collateral.symbol}
        </Typography>

        <Typography variant="xs" className="text-low-emphesis">
          {userCollateralAmountUSD && !userCollateralAmountUSDLoading
            ? currencyFormatter.format(Number(userCollateralAmountUSD?.toExact()))
            : '-'}
        </Typography>
      </div>

      <div className={classNames('flex flex-col !items-end !justify-center', TABLE_TBODY_TD_CLASSNAME(2, 6))}>
        <Typography weight={700} className="text-high-emphesis">
          {formatNumber(liquidationPrice.invert().toSignificant(6))} {asset.symbol}
        </Typography>
        <Typography variant="xs" className="text-low-emphesis">
          {collateral.symbol}
        </Typography>
      </div>

      <div className={classNames('flex flex-col !items-end', TABLE_TBODY_TD_CLASSNAME(3, 6))}>
        <Typography weight={700} className="text-high-emphesis">
          {formatNumber(currentUserBorrowAmount.toSignificant(6))} {asset.symbol}
        </Typography>
        <Typography variant="xs" className="text-low-emphesis">
          {currentUserBorrowAmountUSD && !currentUserBorrowAmountUSDLoading
            ? currencyFormatter.format(Number(currentUserBorrowAmountUSD?.toExact()))
            : '-'}
        </Typography>
      </div>
      <div className={classNames('flex flex-col !items-end', TABLE_TBODY_TD_CLASSNAME(4, 6))}>
        <Typography weight={700} className="flex items-center text-high-emphesis">
          {formatPercent(health.toFixed(2))} <GradientDot percent={health.toFixed(2)} />
        </Typography>
        <Typography variant="xs" className="text-low-emphesis">
          {i18n._(t`health`)}
        </Typography>
      </div>
      <div className={classNames('flex flex-col !items-end', TABLE_TBODY_TD_CLASSNAME(5, 6))}>
        <Typography weight={700} className="text-high-emphesis">
          {formatPercent(currentInterestPerYear.toFixed(2))}
        </Typography>
        <Typography variant="xs" className="text-low-emphesis">
          {i18n._(t`annualized`)}
        </Typography>
      </div>
    </div>
  )
}

export default memo(KashiLendingListItem)
