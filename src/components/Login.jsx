import { useState } from 'react'
import { TalkLogo, KakaoBubble } from '../lib/icons'
import { DEMO_PASSWORD } from '../lib/demo'
import { KAKAO_JS_KEY } from '../config'

export default function Login({ onLogin }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (pw === DEMO_PASSWORD) onLogin()
    else {
      setError('비밀번호가 맞지 않아요.')
      setPw('')
    }
  }

  return (
    <div className="login">
      <div className="login-card">
        <TalkLogo big />
        <h1>카카오톡 웹</h1>
        <p className="sub">Trivial Talk</p>
        <p className="desc">PC에 카카오톡을 설치하지 않아도<br />웹에서 메시지, 사진, 음성, 파일을 보낼 수 있어요.</p>

        <button className="kakao-login" disabled={!KAKAO_JS_KEY} title={KAKAO_JS_KEY ? '' : '카카오 키 설정 후 사용 가능'}>
          <KakaoBubble /> 카카오 로그인
        </button>
        {!KAKAO_JS_KEY && <p className="hint">카카오 키를 설정하면 사용할 수 있어요.</p>}

        <div className="divider"><span>또는 데모로 체험하기</span></div>

        <form className="demo-login" onSubmit={submit}>
          <div className="pw-row">
            <input
              type="password"
              inputMode="numeric"
              placeholder="데모 비밀번호"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setError('') }}
              className={error ? 'shake' : ''}
              autoFocus
            />
            <span className="pw-hint">비밀번호: <b>{DEMO_PASSWORD}</b></span>
          </div>
          {error && <p className="error">{error}</p>}
          <button className="btn dark" type="submit">데모 로그인</button>
        </form>
      </div>
    </div>
  )
}
