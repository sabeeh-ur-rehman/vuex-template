import LoginView from '@views/Login'
import { getServerMode } from '@core/utils/serverHelpers'

const LoginPage = async () => {
  const mode = await getServerMode()
  const allowSelf = process.env.NEXT_PUBLIC_ALLOW_SELF_REGISTER === 'true'

  return <LoginView mode={mode} allowSelfRegister={allowSelf} />
}

export default LoginPage
