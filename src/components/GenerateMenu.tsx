'use client'

// React Imports
import type { ReactNode } from 'react'

// MUI Imports
import type { ChipProps } from '@mui/material/Chip'

// Type Imports
import type {
  VerticalMenuDataType,
  VerticalSectionDataType,
  VerticalSubMenuDataType,
  VerticalMenuItemDataType,
  HorizontalMenuDataType,
  HorizontalSubMenuDataType,
  HorizontalMenuItemDataType
} from '@/types/menuTypes'

// Component Imports
import { SubMenu as HorizontalSubMenu, MenuItem as HorizontalMenuItem } from '@menu/horizontal-menu'
import { SubMenu as VerticalSubMenu, MenuItem as VerticalMenuItem, MenuSection } from '@menu/vertical-menu'
import CustomChip from '@core/components/mui/Chip'

// Context & Util Imports
import { useAuth } from '@/@core/contexts/authContext'
import { hasRole } from '@/utils/rbac'

// Generate a menu from the menu data array
export const GenerateVerticalMenu = ({ menuData }: { menuData: VerticalMenuDataType[] }) => {
  // Hooks
  const { user } = useAuth()

  const renderMenuItems = (data: VerticalMenuDataType[]): JSX.Element[] => {
    // Filter menu based on roles and iterate
    return data
      .filter(item => {
        const roles = (item as any).roles

        return roles ? (user ? hasRole([user.role], roles) : false) : true
      })
      .map((item: VerticalMenuDataType, index) => {
        const menuSectionItem = item as VerticalSectionDataType
        const subMenuItem = item as VerticalSubMenuDataType
        const menuItem = item as VerticalMenuItemDataType

        // Check if the current item is a section
        if (menuSectionItem.isSection) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { children, isSection, ...rest } = menuSectionItem

          // If it is, return a MenuSection component and call generateMenu with the current menuSectionItem's children
          return (
            <MenuSection key={index} {...rest}>
              {children && renderMenuItems(children)}
            </MenuSection>
          )
        }

        // Check if the current item is a sub menu
        if (subMenuItem.children) {
          const { children, icon, prefix, suffix, ...rest } = subMenuItem

          const childItems = children ? renderMenuItems(children) : []

          if (childItems.length === 0) return null

          const Icon = icon ? <i className={icon} /> : null

          const subMenuPrefix: ReactNode =
            prefix && (prefix as ChipProps).label ? (
              <CustomChip size='small' round='true' {...(prefix as ChipProps)} />
            ) : (
              (prefix as ReactNode)
            )

          const subMenuSuffix: ReactNode =
            suffix && (suffix as ChipProps).label ? (
              <CustomChip size='small' round='true' {...(suffix as ChipProps)} />
            ) : (
              (suffix as ReactNode)
            )

          // If it is, return a SubMenu component and call generateMenu with the current subMenuItem's children
          return (
            <VerticalSubMenu
              key={index}
              prefix={subMenuPrefix}
              suffix={subMenuSuffix}
              {...rest}
              {...(Icon && { icon: Icon })}
            >
              {childItems}
            </VerticalSubMenu>
          )
        }

        // If the current item is neither a section nor a sub menu, return a MenuItem component
        const { label, icon, prefix, suffix, ...rest } = menuItem

        // Localize the href
        const href = rest.href

        const Icon = icon ? <i className={icon} /> : null

        const menuItemPrefix: ReactNode =
          prefix && (prefix as ChipProps).label ? (
            <CustomChip size='small' round='true' {...(prefix as ChipProps)} />
          ) : (
            (prefix as ReactNode)
          )

        const menuItemSuffix: ReactNode =
          suffix && (suffix as ChipProps).label ? (
            <CustomChip size='small' round='true' {...(suffix as ChipProps)} />
          ) : (
            (suffix as ReactNode)
          )

        return (
          <VerticalMenuItem
            key={index}
            prefix={menuItemPrefix}
            suffix={menuItemSuffix}
            {...rest}
            href={href}
            {...(Icon && { icon: Icon })}
          >
            {label}
          </VerticalMenuItem>
        )
      })
  }

  return <>{renderMenuItems(menuData)}</>
}

// Generate a menu from the menu data array
export const GenerateHorizontalMenu = ({ menuData }: { menuData: HorizontalMenuDataType[] }) => {
  // Hooks
  const { user } = useAuth()

  const renderMenuItems = (data: HorizontalMenuDataType[]): JSX.Element[] => {
    // Filter menu based on roles and iterate
    return data
      .filter(item => {
        const roles = (item as any).roles

        return roles ? (user ? hasRole([user.role], roles) : false) : true
      })
      .map((item: HorizontalMenuDataType, index) => {
        const subMenuItem = item as HorizontalSubMenuDataType
        const menuItem = item as HorizontalMenuItemDataType

        // Check if the current item is a sub menu
        if (subMenuItem.children) {
          const { children, icon, prefix, suffix, ...rest } = subMenuItem

          const childItems = children ? renderMenuItems(children) : []

          if (childItems.length === 0) return null

          const Icon = icon ? <i className={icon} /> : null

          const subMenuPrefix: ReactNode =
            prefix && (prefix as ChipProps).label ? (
              <CustomChip size='small' round='true' {...(prefix as ChipProps)} />
            ) : (
              (prefix as ReactNode)
            )

          const subMenuSuffix: ReactNode =
            suffix && (suffix as ChipProps).label ? (
              <CustomChip size='small' round='true' {...(suffix as ChipProps)} />
            ) : (
              (suffix as ReactNode)
            )

          // If it is, return a SubMenu component and call generateMenu with the current subMenuItem's children
          return (
            <HorizontalSubMenu
              key={index}
              prefix={subMenuPrefix}
              suffix={subMenuSuffix}
              {...rest}
              {...(Icon && { icon: Icon })}
            >
              {childItems}
            </HorizontalSubMenu>
          )
        }

        // If the current item is not a sub menu, return a MenuItem component
        const { label, icon, prefix, suffix, ...rest } = menuItem

        // Localize the href
        const href = rest.href

        const Icon = icon ? <i className={icon} /> : null

        const menuItemPrefix: ReactNode =
          prefix && (prefix as ChipProps).label ? (
            <CustomChip size='small' round='true' {...(prefix as ChipProps)} />
          ) : (
            (prefix as ReactNode)
          )

        const menuItemSuffix: ReactNode =
          suffix && (suffix as ChipProps).label ? (
            <CustomChip size='small' round='true' {...(suffix as ChipProps)} />
          ) : (
            (suffix as ReactNode)
          )

        return (
          <HorizontalMenuItem
            key={index}
            prefix={menuItemPrefix}
            suffix={menuItemSuffix}
            {...rest}
            href={href}
            {...(Icon && { icon: Icon })}
          >
            {label}
          </HorizontalMenuItem>
        )
      })
  }

  return <>{renderMenuItems(menuData)}</>
}
