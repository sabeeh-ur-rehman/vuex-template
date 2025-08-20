// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const horizontalMenuData = (): HorizontalMenuDataType[] => [
  {
    label: 'Home',
    href: '/home',
    icon: 'tabler-smart-home'
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
    label: 'CRM',
    icon: 'tabler-users',
    roles: ['admin', 'rep', 'user'],
    children: [
      {
        label: 'Leads',
        href: '/crm/leads',
        icon: 'tabler-user-plus',
        roles: ['admin', 'rep']
      },
      {
        label: 'Customers',
        href: '/crm/customers',
        icon: 'tabler-user-check',
        roles: ['admin', 'rep', 'user']
      }
    ]
  },
  {
    label: 'Admin',
    icon: 'tabler-settings',
    children: [
      {
        label: 'Templates',
        href: '/templates',
        icon: 'tabler-template'
      },
      {
        label: 'Emails',
        href: '/emails',
        icon: 'tabler-mail'
      }
    ]
  }
]

export default horizontalMenuData
