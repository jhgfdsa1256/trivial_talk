import { useEffect, useState } from 'react'
import { AttachButtons, AttachList, RecordBar } from './Attachments'
import SharePreview from './SharePreview'
import { initKakao } from '../kakao'
import { useRecorder } from '../lib/useRecorder'
import { canNativeShare, nativeShare } from '../lib/share'

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

  const mobile = canNativeShare()
  const limit = mobile ? Infinity : items.length ? MAX_WITH_ATTACH : MAX_TEXT
  const tooLong = text.length > limit
  const canSend = (text.trim() || items.length) && !tooLong

  const clean = () => { setText(''); setItems([]) }

  const send = async (e) => {
    e.preventDefault()
    if (!canSend) return

    // 휴대폰: 기본 공유 창 → 카카오톡 선택 → 링크 없이 메시지/첨부 그대로 전송
    if (mobile) {
      try {
        const r = await nativeShare({ text, items })
        if (r === 'cancelled') return
        if (r?.partial) alert('이 휴대폰은 파일 공유를 지원하지 않아 글만 보냈어요.')
        clean()
      } catch (err) {
        alert('공유 실패: ' + err.message)
      }
      return
    }

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
      {mobile ? (
        <div className="notice">카톡 전송을 누르고 공유 창에서 <b>카카오톡</b>을 고르면, 링크 없이 메시지와 첨부 파일이 그대로 보내져요.</div>
      ) : kakaoError ? (
        <div className="notice">데모 모드: 실제로 보내지 않고, 카톡에 도착하는 모습을 미리 보여줘요.</div>
      ) : (
        <div className="notice">PC에서는 카카오 공유 방식이라 메시지에 버튼이 붙어요. 링크 없이 보내려면 휴대폰에서 이용해 주세요.</div>
      )}
      <p className="hello"><b>{user.name}</b>님, 보낼 메시지를 써 주세요.</p>
      <label className="label" htmlFor="kmsg">메시지</label>
      <textarea id="kmsg" rows={4} placeholder={mobile ? '보낼 메시지' : `한 번에 ${MAX_TEXT}자까지 (첨부 시 ${MAX_WITH_ATTACH}자)`} value={text} onChange={(e) => setText(e.target.value)} />
      {!mobile && <div className={'counter' + (tooLong ? ' over' : '')}>{text.length} / {limit}</div>}

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
