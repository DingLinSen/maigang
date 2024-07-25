import { useCache } from '@/hooks/web/useCache'
import { useCookies } from 'vue3-cookies'
const { cookies } = useCookies()
const { wsCache } = useCache()
const loginUrl = import.meta.env.VITE_WS_BASE_LOGIN_URL
const loginClientId = import.meta.env.VITE_WS_BASE_CLIENTID

export const removeRoken = () => {
  wsCache.clear()
  cookies.remove('access_token')
  cookies.remove('TGC')
  cookies.remove('refresh_token')
  cookies.remove('Admin-Expires-In')
  const href = encodeURIComponent(window.location.href)

  console.log(href, 99)
  window.location.href =
    loginUrl + '?clientId=' + loginClientId + '&redirectUri=' + href + '&logout=true'
}
