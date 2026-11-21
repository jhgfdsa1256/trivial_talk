export const formatSize = (b) =>
  b >= 1024 * 1024 ? (b / 1024 / 1024).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'

export const formatDur = (s) => {
  s = Math.max(0, Math.round(s || 0))
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0')
}

export const formatTime = (t) =>
  new Date(t).toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' })

export const blobToDataURL = (blob) =>
  new Promise((ok, fail) => {
    const r = new FileReader()
    r.onload = () => ok(r.result)
    r.onerror = fail
    r.readAsDataURL(blob)
  })

// 데모용 음성: 실제 녹음 대신 짧은 멜로디 WAV를 만들어 재생
const toneCache = {}
export function demoToneUrl(sec = 4) {
  if (toneCache[sec]) return toneCache[sec]
  const sr = 8000, n = sr * sec
  const buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf)
  const w = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)))
  w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVE'); w(12, 'fmt ')
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true)
  v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true)
  w(36, 'data'); v.setUint32(40, n * 2, true)
  const notes = [523, 659, 784, 659]
  for (let i = 0; i < n; i++) {
    const t = i / sr, f = notes[Math.floor(t * 2) % notes.length], ph = (t * 2) % 1
    const env = Math.min(1, ph * 30, (1 - ph) * 6) * Math.min(1, (sec - t) * 4)
    v.setInt16(44 + i * 2, Math.sin(2 * Math.PI * f * t) * 0.2 * env * 32767, true)
  }
  return (toneCache[sec] = URL.createObjectURL(new Blob([buf], { type: 'audio/wav' })))
}

export function demoImage(c1 = '#ffd5a8', c2 = '#f7a3a3') {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/></linearGradient></defs><rect width='600' height='400' fill='url(#g)'/><circle cx='470' cy='100' r='50' fill='#fff6'/><path d='M0 400 L180 190 L300 320 L420 230 L600 400Z' fill='#ffffff88'/></svg>`
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}

// 첨부물 src 결정 (데모 음성/파일 포함)
export function resolveSrc(m) {
  if (m.src) return m.src
  if (m.type === 'voice') return demoToneUrl(Math.min(8, Math.max(2, Math.round(m.duration || 4))))
  if (m.type === 'file') return URL.createObjectURL(new Blob([`Trivial Talk 데모 파일입니다.\n원래 파일 이름: ${m.name}\n`], { type: 'text/plain' }))
  return ''
}
