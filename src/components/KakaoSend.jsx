import { useEffect, useState } from 'react'
import { AttachButtons, AttachList, RecordBar } from './Attachments'
import SharePreview from './SharePreview'
import { initKakao } from '../kakao'
import { useRecorder } from '../lib/useRecorder'

const MAX_TEXT = 200
const MAX_WITH_ATTACH = 100

// 카카오톡으로 보내기 (글 2편의 KakaoLink 를 확장)
export default function KakaoSend({ user }) {
  const [text, setText] = useState('')
  const [items, setItems] = useState([])
  const [preview, setPreview] = useState(null)
  const [kakaoError, setKakaoError] = useState(null)
  const recorder = useRecorder()

  useEffect(() => { setKakaoError(initKakao()) }, [])

  const limit = items.length ? MAX_WITH_ATTACH : MAX_TEXT
  const tooLong = text.length > limit
  const canSend = (text.trim() || items.length) && !tooLong

  const clean = () => { setText(''); setItems([]) }

  const send = async (e) => {
    e.preventDefault()
    if (!canSend) return
    const onlySimple = items.every((a) => a.kind === 'image') && items.length <= 1
    if (!kakaoError && onlySimple) {
      // 실제 카카오 전송 (키가 있을 때)
      try {
        if (items[0]) {
          const res = await window.Kakao.Share.uploadImage({ file: [items[0].blob] })
          const url = res.infos.original.url
          window.Kakao.Share.sendDefault({ objectType: 'feed', content: { title: '', description: text, imageUrl: url, link: { webUrl: url, mobileWebUrl: url } } })
        } else {
          window.Kakao.Share.sendDefault({ objectType: 'text', text, link: { webUrl: location.href, mobileWebUrl: location.href } })
        }
        clean()
      } catch (err) {
        alert('전송 실패: ' + (err?.message || JSON.stringify(err)))
      }
      return
    }
    // 데모: 카톡에 어떻게 도착하는지 미리보기
    setPreview({ text, items, from: user.name })
  }

  return (
    <form className="card" onSubmit={send}>
      {kakaoError && <div className="notice">데모 모드: 실제로 보내지 않고, 카톡에 도착하는 모습을 미리 보여줘요.</div>}
      <p className="hello"><b>{user.name}</b>님, 보낼 메시지를 써 주세요.</p>
      <label className="label" htmlFor="kmsg">메시지</label>
      <textarea id="kmsg" rows={4} placeholder={`한 번에 ${MAX_TEXT}자까지 (첨부 시 ${MAX_WITH_ATTACH}자)`} value={text} onChange={(e) => setText(e.target.value)} />
      <div className={'counter' + (tooLong ? ' over' : '')}>{text.length} / {limit}</div>

      <RecordBar recorder={recorder} onDone={(v) => setItems((x) => [...x, v])} />
      <AttachList items={items} onRemove={(i) => setItems((x) => x.filter((_, j) => j !== i))} />

      <div className="buttons">
        <AttachButtons recorder={recorder} onAdd={(a) => setItems((x) => [...x, a])} />
      </div>
      <div className="buttons split">
        <button type="button" className="btn" onClick={clean}>다시 쓰기</button>
        <button type="submit" className="btn primary" disabled={!canSend}>카톡 전송</button>
      </div>

      {preview && <SharePreview data={preview} onClose={() => { setPreview(null); clean() }} />}
    </form>
  )
}
