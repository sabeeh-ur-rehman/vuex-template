import LoginView from '@views/Login'
import { getServerMode } from '@core/utils/serverHelpers'

const LoginPage = async () => {
  const mode = await getServerMode()
  
  return <LoginView mode={mode} />
}

export default LoginPage
