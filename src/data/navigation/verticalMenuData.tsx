// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'

const verticalMenuData = (): VerticalMenuDataType[] => [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'tabler-layout-dashboard'
  },
  {
    label: 'Projects',
    href: '/projects',
    icon: 'tabler-briefcase'
  },
  {
    label: 'Proposals',
    href: '/proposals',
    icon: 'tabler-file-text'
  },
  {
    label: 'Variations',
    href: '/variations',
    icon: 'tabler-adjustments'
  },
  {
    label: 'Price List',
    href: '/pricelist',
    icon: 'tabler-currency-dollar'
  },
  {
    label: 'Admin',
    icon: 'tabler-settings',
    children: [
      {
        label: 'Templates',
        href: '/admin/templates',
        icon: 'tabler-template'
      },
      {
        label: 'Emails',
        href: '/admin/emails',
        icon: 'tabler-mail'
      }
    ]
  }
]

export default verticalMenuData
