// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import { AuthProvider } from '@core/contexts/authContext'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

type Props = ChildrenType

const Layout = async (props: Props) => {
  const { children } = props

  // Vars
  const direction = 'ltr'
  const systemMode = await getSystemMode()

  return (
    <AuthProvider>
      <Providers direction={direction}>
        <BlankLayout systemMode={systemMode}>{children}</BlankLayout>
      </Providers>
    </AuthProvider>
  )
}

export default Layout
