// 휴대폰의 기본 공유 기능(Web Share API)
// 공유 창에서 카카오톡을 고르면 링크 카드가 아니라 "그냥 메시지/첨부 파일"로 보내집니다.

export const isMobile = () =>
  navigator.userAgentData?.mobile ?? /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

export const canNativeShare = () => isMobile() && typeof navigator.share === 'function'

const extOf = (type) => (type.includes('mp4') ? 'm4a' : type.includes('ogg') ? 'ogg' : type.includes('wav') ? 'wav' : 'webm')

const toFile = (a) => {
  if (a.blob instanceof File) return a.blob
  const type = a.blob.type || 'application/octet-stream'
  const name = a.kind === 'voice' ? `음성메시지.${extOf(type)}` : a.name || 'file'
  return new File([a.blob], name, { type })
}

// 반환: 'sent' | 'cancelled' | { partial: true } (파일은 못 보내고 글만 보냄)
export async function nativeShare({ text, items }) {
  const files = items.map(toFile)
  const data = {}
  if (text?.trim()) data.text = text.trim()
  let partial = false
  if (files.length) {
    if (navigator.canShare?.({ files })) data.files = files
    else partial = true
  }
  if (!data.text && !data.files) return { partial: true }
  try {
    await navigator.share(data)
    return partial ? { partial: true } : 'sent'
  } catch (e) {
    if (e.name === 'AbortError') return 'cancelled'
    throw e
  }
}
