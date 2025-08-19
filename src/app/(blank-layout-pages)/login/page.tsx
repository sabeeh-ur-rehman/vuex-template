import LoginView from '@views/Login'
import { getServerMode } from '@core/utils/serverHelpers'
import { env } from '@/server/config/env'

const LoginPage = async () => {
  const mode = await getServerMode()
  const allowSelf = env.ALLOW_SELF_REGISTER === 'true'

  return <LoginView mode={mode} allowSelfRegister={allowSelf} />
}

export default LoginPage
