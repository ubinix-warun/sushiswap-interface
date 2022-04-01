import { GlobeIcon, SwitchVerticalIcon, TrendingUpIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { RocketIcon, WalletIcon } from 'app/components/Icon'
import { Feature } from 'app/enums'
import { featureEnabled } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { ReactNode, useMemo } from 'react'
import { ChainId, SUSHI_ADDRESS } from 'sushiswap-sdk-nervos'

export interface MenuItemLeaf {
  key: string
  title: string
  link: string
  icon?: ReactNode
}

export interface MenuItemNode {
  key: string
  title: string
  items: MenuItemLeaf[]
  icon?: ReactNode
}

export type MenuItem = MenuItemLeaf | MenuItemNode
export type Menu = MenuItem[]

type UseMenu = () => Menu
const useMenu: UseMenu = () => {
  const { i18n } = useLingui()
  const { chainId, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!chainId) return []

    const menu: Menu = []

    const legacyItems = [
      {
        key: 'swap',
        title: i18n._(t`Swap`),
        link: '/swap',
      },
      {
        key: 'limit',
        title: i18n._(t`Limit order`),
        link: '/limit-order',
        disabled: !featureEnabled(Feature.LIMIT_ORDERS, chainId),
      },
      {
        key: 'pool',
        title: i18n._(t`Pool`),
        link: '/pool',
      },
      {
        key: 'add-liquidity',
        title: i18n._(t`Add`),
        link: `/add/ETH/${SUSHI_ADDRESS[chainId]}`,
      },
      // {
      //   key: 'remove-liquidity',
      //   title: i18n._(t`Remove`),
      //   link: '/remove',
      // },
      {
        key: 'migrate',
        title: i18n._(t`Migrate`),
        link: '/migrate',
        disabled: !featureEnabled(Feature.MIGRATE, chainId),
      },
      {
        key: 'import',
        title: i18n._(t`Import`),
        link: '/find',
      },
    ]

    if (featureEnabled(Feature.TRIDENT, chainId)) {
      menu.push({
        key: 'trident',
        title: i18n._(t`Trident`),
        icon: <SwitchVerticalIcon width={20} />,
        items: [
          {
            key: 'trident-swap',
            title: i18n._(t`Swap`),
            link: '/trident/swap',
          },
          {
            key: 'trident-pools',
            title: i18n._(t`Pools`),
            link: '/trident/pools',
          },
          {
            key: 'trident-create',
            title: i18n._(t`Create`),
            link: '/trident/create',
          },
          {
            key: 'trident-migrate',
            title: i18n._(t`Migrate`),
            link: '/trident/migrate',
          },
        ],
      })
    }

    // By default show just a swap button
    let legacy: MenuItem = {
      key: 'legacy',
      title: i18n._(t`Legacy`),
      icon: <SwitchVerticalIcon width={20} />,
      items: legacyItems.filter((item) => !item?.disabled),
    }

    menu.push(legacy)

    if (featureEnabled(Feature.LIQUIDITY_MINING, chainId)) {
      const farmItems = {
        key: 'farm',
        title: i18n._(t`Farm`),
        icon: <SwitchVerticalIcon width={20} className="rotate-90 filter" />,
        items: [
          {
            key: 'farm',
            title: i18n._(t`Onsen Menu`),
            link: '/farm',
          },
          {
            key: 'my-farms',
            title: i18n._(t`My Farms`),
            link: '/farm?filter=portfolio',
          },
        ],
      }
      menu.push(farmItems)
    }

    if (featureEnabled(Feature.KASHI, chainId)) {
      menu.push({
        key: 'kashi',
        title: i18n._(t`Kashi`),
        icon: <SwitchVerticalIcon width={20} className="rotate-90 filter" />,
        items: [
          {
            key: 'lend',
            title: i18n._(t`Lend`),
            link: '/kashi?view=lend',
          },
          {
            key: 'borrow',
            title: i18n._(t`Borrow`),
            link: '/kashi?view=borrow',
          },
        ],
      })
    }

    if (featureEnabled(Feature.MISO, chainId)) {
      const misoMenu = {
        key: 'miso',
        title: i18n._(t`MISO`),
        icon: <RocketIcon width={20} />,
        items: [
          {
            key: 'marketplace',
            title: i18n._(t`Marketplace`),
            link: '/miso',
          },
        ],
      }

      if (chainId !== ChainId.ETHEREUM) {
        misoMenu.items.push({
          key: 'launchpad',
          title: i18n._(t`Launchpad`),
          link: '/miso/auction',
        })
      }

      menu.push(misoMenu)
    }

    const exploreMenu: MenuItemLeaf[] = []

    if (featureEnabled(Feature.STAKING, chainId)) {
      exploreMenu.push({
        key: 'sushi-bar',
        title: i18n._(t`Sushi Bar`),
        link: '/stake',
      })
    }

    if (featureEnabled(Feature.MEOWSHI, chainId)) {
      exploreMenu.push({
        key: 'meowshi',
        title: i18n._(t`Meowshi`),
        link: '/tools/meowshi',
      })
    }

    if (featureEnabled(Feature.MEOWSHI, chainId)) {
      exploreMenu.push({
        key: 'yield',
        title: i18n._(t`Yield Strategies`),
        link: '/tools/inari',
      })
    }

    if (exploreMenu.length > 0) {
      menu.push({
        key: 'explore',
        title: i18n._(t`Explore`),
        items: exploreMenu,
        icon: <GlobeIcon width={20} />,
      })
    }

    let analyticsMenu: MenuItem = {
      key: 'analytics',
      title: i18n._(t`Analytics`),
      icon: <TrendingUpIcon width={20} />,
      items: [
        {
          key: 'dashboard',
          title: 'Dashboard',
          link: `/analytics/${chainId}/dashboard`,
        },
        {
          key: 'xsushi',
          title: 'xSUSHI',
          link: '/analytics/xsushi',
        },
        {
          key: 'tokens',
          title: 'Tokens',
          link: `/analytics/${chainId}/tokens`,
        },
        {
          key: 'pairs',
          title: 'Pairs',
          link: `/analytics/${chainId}/pairs`,
        },
      ],
    }

    if (featureEnabled(Feature.BENTOBOX, chainId)) {
      analyticsMenu.items.push({
        key: 'farms',
        title: 'Farms',
        link: `/analytics/${chainId}/farms`,
      })
    }

    if (featureEnabled(Feature.BENTOBOX, chainId)) {
      analyticsMenu.items.push({
        key: 'bentobox',
        title: 'Bentobox',
        link: `/analytics/${chainId}/bentobox`,
      })
    }

    if (featureEnabled(Feature.ANALYTICS, chainId)) {
      menu.push(analyticsMenu)
    }

    if (account) {
      menu.push({
        key: 'portfolio',
        title: i18n._(t`Portfolio`),
        link: `/account/${account}`,
        icon: <WalletIcon width={20} />,
      })
    }

    return menu.filter((el) => Object.keys(el).length > 0)
  }, [account, chainId, i18n])
}

export default useMenu
