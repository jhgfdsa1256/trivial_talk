import { KAKAO_JS_KEY } from '../config'
import { initKakao } from '../kakao'

// 카카오 로그인 (인가 코드 방식)
// 1) login(): 카카오 로그인 화면으로 이동
// 2) 카카오가 우리 사이트로 ?code=... 를 붙여 돌려보냄
// 3) finishLogin(): code 로 토큰을 받고, 토큰으로 닉네임/프로필 사진 조회
// 리다이렉트 URI = 사이트 주소(origin). 카카오 콘솔 > 플랫폼 키 > JavaScript 키에 등록된 값과 같아야 합니다.
const redirectUri = () => location.origin
const STATE_KEY = 'trivial_talk_oauth_state'

export function login() {
  const err = initKakao()
  if (err) return alert(err)
  const state = Math.random().toString(36).slice(2)
  try { sessionStorage.setItem(STATE_KEY, state) } catch { /* 무시 */ }
  window.Kakao.Auth.authorize({ redirectUri: redirectUri(), state })
}

export const hasLoginCallback = () => {
  const q = new URLSearchParams(location.search)
  return q.has('code') || q.has('error')
}

export async function finishLogin() {
  const q = new URLSearchParams(location.search)
  // 주소창에서 code 제거 (새로고침해도 다시 처리하지 않도록)
  history.replaceState(null, '', location.pathname + location.hash)

  if (q.get('error')) {
    if (q.get('error') === 'access_denied') throw new Error('로그인을 취소했어요.')
    throw new Error(q.get('error_description') || q.get('error'))
  }
  let saved = null
  try { saved = sessionStorage.getItem(STATE_KEY); sessionStorage.removeItem(STATE_KEY) } catch { /* 무시 */ }
  if (saved && q.get('state') !== saved) throw new Error('로그인 요청이 올바르지 않아요. 다시 시도해 주세요.')

  const initErr = initKakao()
  if (initErr) throw new Error(initErr)

  const res = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: KAKAO_JS_KEY,
      redirect_uri: redirectUri(),
      code: q.get('code'),
    }),
  })
  const token = await res.json().catch(() => ({}))
  if (!res.ok || !token.access_token) {
    throw new Error(`토큰 발급 실패 (${token.error_code || res.status}): ${token.error_description || token.error || '알 수 없는 오류'}`)
  }

  window.Kakao.Auth.setAccessToken(token.access_token)
  const me = await window.Kakao.API.request({ url: '/v2/user/me' })
  const profile = me.kakao_account?.profile || {}
  return {
    id: 'kakao_' + me.id,
    kakao: true,
    name: profile.nickname || me.properties?.nickname || '카카오 사용자',
    image: profile.thumbnail_image_url || profile.profile_image_url || me.properties?.thumbnail_image || '',
  }
}

export async function logout() {
  try {
    if (!initKakao() && window.Kakao.Auth.getAccessToken()) await window.Kakao.Auth.logout()
  } catch { /* 토큰 만료 등은 무시 */ }
}
