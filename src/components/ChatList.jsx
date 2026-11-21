import { GroupAvatar } from './Avatar'
import { formatTime } from '../lib/media'

const preview = (m) => {
  if (!m) return ''
  if (m.type === 'image') return '사진'
  if (m.type === 'voice') return '음성 메시지'
  if (m.type === 'file') return '파일: ' + m.name
  return m.text
}

export default function ChatList({ rooms, onOpen }) {
  const sorted = [...rooms].sort((a, b) => (b.messages.at(-1)?.at || 0) - (a.messages.at(-1)?.at || 0))
  return (
    <ul className="room-list">
      {sorted.map((r) => {
        const last = r.messages.at(-1)
        return (
          <li key={r.id}>
            <button className="room" onClick={() => onOpen(r.id)}>
              <GroupAvatar ids={r.members} />
              <div className="room-main">
                <div className="room-top">
                  <b>{r.name}</b>
                  {r.members.length > 1 && <span className="count">{r.members.length + 1}</span>}
                </div>
                <div className="room-last">{r.typing ? '입력 중…' : preview(last)}</div>
              </div>
              <div className="room-side">
                <span className="room-time">{last && formatTime(last.at)}</span>
                {r.unread > 0 && <span className="badge">{r.unread > 99 ? '99+' : r.unread}</span>}
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
