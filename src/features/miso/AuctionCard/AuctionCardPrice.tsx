import { formatNumber } from 'app/functions'
import useInterval from 'app/hooks/useInterval'
import { FC, useState } from 'react'
import { Currency, Price, Token } from 'sushiswap-sdk-nervos'

import { Auction } from '../context/Auction'

const AuctionCardPrice: FC<{ auction: Auction }> = ({ auction, children }) => {
  const [price, setPrice] = useState<Price<Token, Currency> | undefined>()

  useInterval(() => {
    setPrice(auction.currentPrice)
  }, 1000)

  if (typeof children === 'function') {
    return children({ price })
  }

  if (price) {
    return (
      <>
        {formatNumber(price?.toSignificant(6))} {price?.quoteCurrency.symbol}
      </>
    )
  }

  return <></>
}

export default AuctionCardPrice
