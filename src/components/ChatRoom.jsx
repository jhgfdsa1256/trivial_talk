import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Avatar from './Avatar'
import VoicePlayer from './VoicePlayer'
import FileChip from './FileChip'
import { AttachButtons, AttachList, RecordBar } from './Attachments'
import { BackIcon, SendIcon } from '../lib/icons'
import { PEOPLE } from '../lib/demo'
import { formatTime } from '../lib/media'
import { useRecorder } from '../lib/useRecorder'

function Bubble({ m, onLoad }) {
  if (m.expired) return <div className="bubble muted">새로고침되어 만료된 첨부예요</div>
  if (m.type === 'image') return <img className="bubble-img" src={m.src} alt="사진" onLoad={onLoad} />
  if (m.type === 'voice') return <div className="bubble plain"><VoicePlayer msg={m} compact /></div>
  if (m.type === 'file') return <div className="bubble plain"><FileChip file={m} download /></div>
  return <div className="bubble">{m.text}</div>
}

export default function ChatRoom({ room, onBack, onSend, onRead }) {
  const [text, setText] = useState('')
  const [items, setItems] = useState([])
  const recorder = useRecorder()
  const list = useRef(null)
  const toBottom = () => { const el = list.current; if (el) el.scrollTop = el.scrollHeight }

  useEffect(() => { onRead() }, [room.messages.length]) // eslint-disable-line
  useLayoutEffect(toBottom, [room.messages.length, room.typing])

  const submit = (e) => {
    e.preventDefault()
    if (!text.trim() && !items.length) return
    onSend({ text, attachments: items })
    setText('')
    setItems([])
  }

  let prevFrom = null
  return (
    <section className="chat-room">
      <div className="room-bar">
        <button className="icon-btn" onClick={onBack} aria-label="채팅 목록으로"><BackIcon /></button>
        <b>{room.name}</b>
        {room.members.length > 1 && <span className="count">{room.members.length + 1}</span>}
      </div>

      <div className="messages" ref={list}>
        {room.messages.map((m) => {
          const mine = m.from === 'me'
          const showName = !mine && prevFrom !== m.from
          prevFrom = m.from
          return (
            <div key={m.id} className={'msg' + (mine ? ' mine' : '') + (showName ? ' first' : '')}>
              {!mine && (showName ? <Avatar id={m.from} size={36} /> : <span className="avatar-space" />)}
              <div className="msg-body">
                {showName && <div className="msg-name">{PEOPLE[m.from]?.name}</div>}
                <div className="msg-line">
                  <Bubble m={m} onLoad={toBottom} />
                  <span className="msg-time">{formatTime(m.at)}</span>
                </div>
              </div>
            </div>
          )
        })}
        {room.typing && (
          <div className="msg first">
            <Avatar id={room.typing} size={36} />
            <div className="msg-body">
              <div className="msg-name">{PEOPLE[room.typing]?.name}</div>
              <div className="bubble typing"><i /><i /><i /></div>
            </div>
          </div>
        )}
      </div>

      <form className="composer" onSubmit={submit}>
        <RecordBar recorder={recorder} onDone={(v) => setItems((x) => [...x, v])} />
        {items.length > 0 && <div className="staged"><AttachList items={items} onRemove={(i) => setItems((x) => x.filter((_, j) => j !== i))} /></div>}
        <div className="composer-row">
          <AttachButtons recorder={recorder} onAdd={(a) => setItems((x) => [...x, a])} labels={false} />
          <input
            className="composer-input"
            placeholder="메시지 입력"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="send" type="submit" disabled={!text.trim() && !items.length} aria-label="보내기">
            <SendIcon />
          </button>
        </div>
      </form>
    </section>
  )
}
