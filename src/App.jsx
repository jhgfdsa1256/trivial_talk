import { useState } from 'react'
import Header from './components/Header'
import Login from './components/Login'
import ChatList from './components/ChatList'
import ChatRoom from './components/ChatRoom'
import KakaoSend from './components/KakaoSend'
import { ChatIcon, KakaoBubble } from './lib/icons'
import { ME } from './lib/demo'
import { useRooms } from './lib/useRooms'

const SESSION = 'trivial_talk_user'
const readUser = () => { try { return JSON.parse(localStorage.getItem(SESSION)) } catch { return null } }

export default function App() {
  const [user, setUser] = useState(readUser)
  const [tab, setTab] = useState('chat')
  const [openId, setOpenId] = useState(null)
  const { rooms, send, markRead } = useRooms(openId)

  const login = () => {
    setUser(ME)
    try { localStorage.setItem(SESSION, JSON.stringify(ME)) } catch { /* 무시 */ }
  }
  const logout = () => {
    setUser(null)
    setOpenId(null)
    try { localStorage.removeItem(SESSION) } catch { /* 무시 */ }
  }

  if (!user) return <Login onLogin={login} />

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
