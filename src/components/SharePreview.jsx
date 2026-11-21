import { useState } from 'react'
import Avatar from './Avatar'
import VoicePlayer from './VoicePlayer'
import FileChip from './FileChip'
import { BackIcon, DocIcon, MicIcon, XIcon, TalkLogo } from '../lib/icons'
import { formatDur, formatSize, formatTime } from '../lib/media'

// ② 카톡에 도착한 모습 + ③ 링크를 눌렀을 때 열리는 페이지 (데모)
export default function SharePreview({ data, onClose }) {
  const [page, setPage] = useState(false)
  const now = formatTime(Date.now())
  const voices = data.items.filter((a) => a.kind === 'voice')
  const files = data.items.filter((a) => a.kind === 'file')
  const images = data.items.filter((a) => a.kind === 'image')

  const cards = []
  images.forEach((a) => cards.push({ key: a.url, hero: <img src={a.url} alt="" />, title: '사진', desc: data.text, btn: '자세히 보기' }))
  voices.forEach((a) => cards.push({ key: a.url, heroClass: 'voice', hero: <MicIcon size={54} />, title: `음성 메시지 (${formatDur(a.duration)})`, desc: data.text, btn: '듣기' }))
  files.forEach((a) => cards.push({ key: a.url, heroClass: 'file', hero: <DocIcon size={52} />, title: a.name, desc: `${formatSize(a.size)} · 7일 후 만료`, btn: '파일 받기' }))
  if (!cards.length) cards.push({ key: 't', text: true })

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-bar">
          {page ? (
            <button type="button" className="icon-btn" onClick={() => setPage(false)} aria-label="뒤로"><BackIcon /></button>
          ) : <span style={{ width: 34 }} />}
          <b>{page ? '링크를 눌렀을 때' : '카카오톡에 이렇게 도착해요'}</b>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="닫기"><XIcon /></button>
        </div>

        {!page ? (
          <div className="kchat">
            <div className="ktop">{data.from}</div>
            {cards.map((c, i) => (
              <div className="msg first" key={c.key}>
                {i === 0 ? <Avatar id="me" size={38} /> : <span className="avatar-space" />}
                <div className="msg-body">
                  {i === 0 && <div className="msg-name dark">{data.from}</div>}
                  <div className="msg-line">
                    {c.text ? (
                      <div className="kcard"><div className="body"><div className="d strong">{data.text}</div></div><div className="kb">자세히 보기</div></div>
                    ) : (
                      <div className="kcard">
                        <div className={'hero ' + (c.heroClass || '')}>{c.hero}</div>
                        <div className="body"><div className="t">{c.title}</div>{c.desc && <div className="d">{c.desc}</div>}</div>
                        <button type="button" className="kb" onClick={() => setPage(true)}>{c.btn}</button>
                      </div>
                    )}
                    <span className="msg-time dark">{now}</span>
                  </div>
                </div>
              </div>
            ))}
            <p className="kdemo-note">데모 화면이에요. 실제 카드 모양은 카카오 템플릿을 따라요.</p>
          </div>
        ) : (
          <div className="link-page">
            <header className="header small"><TalkLogo /><div className="grow"><h1>카카오톡 웹</h1><p className="subtitle">Trivial Talk</p></div></header>
            <div className="player">
              <p className="from">{data.from}님이 보낸 메시지</p>
              {data.text && <h2>{data.text}</h2>}
              {images.map((a) => <img key={a.url} className="link-img" src={a.url} alt="" />)}
              {voices.map((a) => <VoicePlayer key={a.url} msg={{ src: a.url, duration: a.duration }} />)}
              {files.map((a) => <FileChip key={a.url} file={a} />)}
              {files.length > 0 && (
                <a className="btn primary dl" href={files[0].url} download={files[0].name}>파일 다운로드</a>
              )}
              <p className="expire">이 링크는 7일 뒤 자동으로 만료됩니다.<br />로그인 없이 누구나 열 수 있어요.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
