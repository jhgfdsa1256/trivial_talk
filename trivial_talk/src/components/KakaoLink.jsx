import { useEffect, useRef, useState } from 'react'
import { initKakao } from '../kakao'

const MAX_TEXT = 200 // 텍스트만 보낼 때
const MAX_WITH_IMAGE = 100 // 이미지 첨부 시

export default function KakaoLink() {
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [localUrl, setLocalUrl] = useState('')
  const [error, setError] = useState(null)
  const [sending, setSending] = useState(false)
  const fileInput = useRef(null)

  // 블로그와 동일: 컴포넌트가 처음 뜰 때 한 번만 Kakao.init
  useEffect(() => {
    setError(initKakao())
  }, [])

  // 미리보기용 blob URL 정리
  useEffect(() => () => localUrl && URL.revokeObjectURL(localUrl), [localUrl])

  const limit = file ? MAX_WITH_IMAGE : MAX_TEXT
  const tooLong = text.length > limit
  const canSend = !error && !sending && text.trim().length > 0 && !tooLong

  const clean = () => {
    setText('')
    setFile(null)
    setLocalUrl('')
    if (fileInput.current) fileInput.current.value = ''
  }

  const handleUpload = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setLocalUrl(URL.createObjectURL(f))
  }

  const sendLink = (imageUrl) => {
    // 블로그의 Kakao.Link.sendDefault → SDK v2 에서는 Kakao.Share.sendDefault
    if (imageUrl) {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: '',
          description: text,
          imageUrl,
          link: { webUrl: imageUrl, mobileWebUrl: imageUrl },
        },
      })
    } else {
      window.Kakao.Share.sendDefault({
        objectType: 'text',
        text,
        link: { webUrl: location.href, mobileWebUrl: location.href },
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSend) return
    setSending(true)
    try {
      if (file) {
        // 이미지를 카카오 서버에 먼저 올리고 받은 URL로 feed 전송
        const res = await window.Kakao.Share.uploadImage({ file: [file] })
        sendLink(res.infos.original.url)
      } else {
        sendLink('')
      }
      clean()
    } catch (err) {
      alert('전송 실패: ' + (err?.message || JSON.stringify(err)))
    } finally {
      setSending(false)
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      {error && <div className="notice">⚠️ {error}</div>}

      <label className="label" htmlFor="message">메시지</label>
      <textarea
        id="message"
        rows={6}
        autoFocus
        placeholder={`한 번에 ${MAX_TEXT}자까지 전송 가능 (이미지 첨부 시 ${MAX_WITH_IMAGE}자)`}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className={'counter' + (tooLong ? ' over' : '')}>
        {text.length} / {limit}
      </div>

      {localUrl && (
        <div className="preview">
          <img src={localUrl} alt="첨부 이미지 미리보기" />
          <button type="button" className="remove" onClick={() => { setFile(null); setLocalUrl(''); fileInput.current.value = '' }}>
            ✕
          </button>
        </div>
      )}

      <div className="buttons">
        <button type="button" className="btn" onClick={clean}>다시 쓰기</button>
        <input
          ref={fileInput}
          id="button-file"
          type="file"
          accept="image/*"
          hidden
          onChange={handleUpload}
        />
        <label htmlFor="button-file" className="btn">이미지 올리기</label>
        <button type="submit" className="btn primary" disabled={!canSend}>
          {sending ? '전송 중…' : '카톡 전송'}
        </button>
      </div>
    </form>
  )
}
