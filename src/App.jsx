import { useEffect, useState } from 'react'
import Header from './components/Header'
import Login from './components/Login'
import ChatList from './components/ChatList'
import ChatRoom from './components/ChatRoom'
import KakaoSend from './components/KakaoSend'
import { ChatIcon, KakaoBubble } from './lib/icons'
import { ME, setMe } from './lib/demo'
import { finishLogin, hasLoginCallback, logout as kakaoLogout } from './lib/kakaoAuth'
import { useRooms } from './lib/useRooms'

const SESSION = 'trivial_talk_user'
const readUser = () => {
  try {
    const u = JSON.parse(localStorage.getItem(SESSION))
    if (u) setMe(u)
    return u
  } catch { return null }
}

export default function App() {
  const [user, setUser] = useState(readUser)
  const [status, setStatus] = useState(() => (hasLoginCallback() ? { busy: true } : null))
  const [tab, setTab] = useState('chat')
  const [openId, setOpenId] = useState(null)
  const { rooms, send, markRead } = useRooms(openId)

  const login = (u = ME) => {
    setMe(u)
    setUser(u)
    try { localStorage.setItem(SESSION, JSON.stringify(u)) } catch { /* 무시 */ }
  }

  // 카카오 로그인 후 돌아왔을 때 (?code=...)
  useEffect(() => {
    if (!hasLoginCallback()) return
    finishLogin()
      .then((u) => { setStatus(null); login(u) })
      .catch((e) => setStatus({ error: e.message }))
  }, [])

  const logout = () => {
    if (user?.kakao) kakaoLogout()
    setMe(ME)
    setUser(null)
    setOpenId(null)
    try { localStorage.removeItem(SESSION) } catch { /* 무시 */ }
  }

  if (!user) return <Login onLogin={() => login(ME)} status={status} />

  const unread = rooms.reduce((s, r) => s + r.unread, 0)
  const room = rooms.find((r) => r.id === openId)

  return (
    <div className="app">
      <Header user={user} onLogout={logout} />
      {!room && (
        <nav className="tabs">
          <button className={tab === 'chat' ? 'on' : ''} onClick={() => setTab('chat')}>
            <ChatIcon /> 채팅 {unread > 0 && <span className="badge">{unread}</span>}
          </button>
          <button className={tab === 'kakao' ? 'on' : ''} onClick={() => setTab('kakao')}>
            <KakaoBubble size={16} /> 카톡으로 보내기
          </button>
        </nav>
      )}
      <main className="content">
        {room ? (
          <ChatRoom
            key={room.id}
            room={room}
            onBack={() => setOpenId(null)}
            onSend={(msg) => send(room.id, msg)}
            onRead={() => markRead(room.id)}
          />
        ) : tab === 'chat' ? (
          <ChatList rooms={rooms} onOpen={setOpenId} />
        ) : (
          <KakaoSend user={user} />
        )}
      </main>
    </div>
  )
}
