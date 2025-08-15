// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const horizontalMenuData = (): HorizontalMenuDataType[] => [
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
    href: '/price-list',
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

export default horizontalMenuData
