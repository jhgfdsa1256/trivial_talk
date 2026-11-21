import { useEffect, useRef, useState } from 'react'

// 브라우저 내장 MediaRecorder 로 마이크 녹음
export function useRecorder() {
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const rec = useRef(null)
  const timer = useRef(null)
  const startAt = useRef(0)

  const cleanup = () => {
    clearInterval(timer.current)
    rec.current?.stream.getTracks().forEach((t) => t.stop())
    rec.current = null
    setRecording(false)
    setSeconds(0)
  }
  useEffect(() => cleanup, [])

  const start = async () => {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      alert('이 브라우저는 녹음을 지원하지 않아요.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      const chunks = []
      mr.ondataavailable = (e) => e.data.size && chunks.push(e.data)
      mr.chunks = chunks
      mr.start()
      rec.current = mr
      startAt.current = Date.now()
      setRecording(true)
      timer.current = setInterval(() => setSeconds((Date.now() - startAt.current) / 1000), 200)
    } catch {
      alert('마이크를 사용할 수 없어요. 브라우저에서 마이크 권한을 허용해 주세요.')
    }
  }

  const stop = () =>
    new Promise((ok) => {
      const mr = rec.current
      if (!mr) return ok(null)
      const duration = (Date.now() - startAt.current) / 1000
      mr.onstop = () => {
        const blob = new Blob(mr.chunks, { type: mr.mimeType || 'audio/webm' })
        cleanup()
        ok({ kind: 'voice', blob, url: URL.createObjectURL(blob), duration, size: blob.size, name: '음성 메시지' })
      }
      mr.stop()
    })

  const cancel = () => {
    if (rec.current) {
      rec.current.onstop = null
      rec.current.stop()
    }
    cleanup()
  }

  return { recording, seconds, start, stop, cancel }
}
