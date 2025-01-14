import { getAverageBlockTime, getBlock, getMassBlocks } from 'app/services/graph/fetchers'
import { useActiveWeb3React } from 'app/services/web3'
import { addSeconds, getUnixTime, startOfHour, startOfMinute, startOfSecond, subDays, subWeeks } from 'date-fns'
import stringify from 'fast-json-stable-stringify'
import { ChainId } from 'sushiswap-sdk-nervos'
import useSWR, { SWRConfiguration } from 'swr'

import { GraphProps } from '../interfaces'

export function useOneDayBlock({ chainId = ChainId.ETHEREUM, shouldFetch = true, swrConfig = undefined }) {
  const date = startOfSecond(startOfMinute(startOfHour(subDays(Date.now(), 1))))
  const start = getUnixTime(date)
  const end = getUnixTime(addSeconds(date, 600))
  return useBlock({
    chainId,
    variables: {
      where: {
        timestamp_gt: start,
        timestamp_lt: end,
      },
    },
    shouldFetch,
    swrConfig,
  })
}

export function useTwoDayBlock({ chainId = ChainId.ETHEREUM, shouldFetch = true, swrConfig = undefined }) {
  const date = startOfSecond(startOfMinute(startOfHour(subDays(Date.now(), 2))))
  const start = getUnixTime(date)
  const end = getUnixTime(addSeconds(date, 600))
  return useBlock({
    chainId,
    variables: {
      where: {
        timestamp_gt: start,
        timestamp_lt: end,
      },
    },
    shouldFetch,
    swrConfig,
  })
}

export function useOneWeekBlock({ chainId = ChainId.ETHEREUM, shouldFetch = true, swrConfig = undefined }) {
  const date = startOfSecond(startOfMinute(startOfHour(subWeeks(Date.now(), 1))))
  const start = getUnixTime(date)
  const end = getUnixTime(addSeconds(date, 600))
  return useBlock({
    chainId,
    variables: {
      where: {
        timestamp_gt: start,
        timestamp_lt: end,
      },
    },
    shouldFetch,
    swrConfig,
  })
}

export function useTwoWeekBlock({ chainId = ChainId.ETHEREUM, shouldFetch = true, swrConfig = undefined }) {
  const date = startOfSecond(startOfMinute(startOfHour(subWeeks(Date.now(), 2))))
  const start = getUnixTime(date)
  const end = getUnixTime(addSeconds(date, 600))
  return useBlock({
    chainId,
    variables: {
      where: {
        timestamp_gt: start,
        timestamp_lt: end,
      },
    },
    shouldFetch,
    swrConfig,
  })
}

export function useBlock({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps): { number?: number } {
  const { data } = useSWR(
    shouldFetch ? ['block', chainId, stringify(variables)] : null,
    (_, chainId) => getBlock(chainId, variables),
    swrConfig
  )
  return data
}

interface useMassBlocksProps {
  timestamps: number[] | string[]
  swrConfig?: SWRConfiguration
}

export function useMassBlocks({ timestamps, swrConfig = undefined }: useMassBlocksProps) {
  const { chainId } = useActiveWeb3React()

  const { data } = useSWR(
    chainId ? ['massBlocks', chainId, stringify(timestamps)] : null,
    (_, chainId) => getMassBlocks(chainId, timestamps),
    swrConfig
  )

  return data
}

export function useAverageBlockTime({ chainId = ChainId.ETHEREUM, swrConfig = undefined }) {
  const { data } = useSWR(
    chainId ? ['averageBlockTime', chainId] : null,
    (_, chainId) => getAverageBlockTime(chainId),
    swrConfig
  )
  return data
}
