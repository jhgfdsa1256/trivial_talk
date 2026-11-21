import { KAKAO_JS_KEY } from './config'

// 블로그의 window.Kakao.init(...) 부분. 키가 없거나 SDK 로드 실패 시 이유를 돌려줍니다.
export function initKakao() {
  if (!KAKAO_JS_KEY) return 'JavaScript 키가 아직 없습니다. src/config.js 에 넣어주세요.'
  if (!window.Kakao) return 'Kakao SDK를 불러오지 못했습니다. (index.html 의 script 주소 확인)'
  if (!window.Kakao.isInitialized()) window.Kakao.init(KAKAO_JS_KEY)
  return null
}
