import { TalkLogo } from '../lib/icons'
import Avatar from './Avatar'

export default function Header({ user, onLogout }) {
  return (
    <header className="header">
      <TalkLogo />
      <div className="grow">
        <h1>카카오톡 웹</h1>
        <p className="subtitle">Trivial Talk</p>
      </div>
      {user && (
        <div className="user">
          <Avatar id="me" />
          <div>
            <div className="name">{user.name}</div>
            <button className="logout" onClick={onLogout}>로그아웃</button>
          </div>
        </div>
      )}
    </header>
  )
}
