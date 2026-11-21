import { useRef } from 'react'
import { ImageIcon, MicIcon, ClipIcon, StopIcon, XIcon } from '../lib/icons'
import { formatDur } from '../lib/media'
import VoicePlayer from './VoicePlayer'
import FileChip from './FileChip'

const MAX_FILE = 10 * 1024 * 1024

// 이미지 / 녹음 / 파일 첨부 버튼 + 첨부 목록 (채팅방과 카톡 보내기에서 함께 사용)
export function AttachButtons({ recorder, onAdd, labels = true }) {
  const imgIn = useRef(null)
  const fileIn = useRef(null)

  const pick = (kind) => (e) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    if (f.size > MAX_FILE) return alert('10MB 이하 파일만 보낼 수 있어요.')
    onAdd({ kind, blob: f, url: URL.createObjectURL(f), name: f.name, size: f.size })
  }

  return (
    <>
      <input ref={imgIn} type="file" accept="image/*" hidden onChange={pick('image')} />
      <input ref={fileIn} type="file" hidden onChange={pick('file')} />
      <button type="button" className="btn" onClick={() => imgIn.current.click()} title="이미지">
        <ImageIcon />{labels && '이미지'}
      </button>
      <button type="button" className="btn" onClick={recorder.start} disabled={recorder.recording} title="녹음">
        <MicIcon />{labels && '녹음'}
      </button>
      <button type="button" className="btn" onClick={() => fileIn.current.click()} title="파일">
        <ClipIcon />{labels && '파일'}
      </button>
    </>
  )
}

const BARS = Array.from({ length: 30 }, (_, i) => ({ h: 20 + ((i * 37) % 80), d: (i * 0.07) % 0.9 }))

export function RecordBar({ recorder, onDone }) {
  if (!recorder.recording) return null
  return (
    <div className="rec">
      <span className="dot" />
      <div className="wave">
        {BARS.map((b, i) => <i key={i} style={{ height: b.h + '%', animationDelay: b.d + 's' }} />)}
      </div>
      <b className="rec-time">{formatDur(recorder.seconds)}</b>
      <button type="button" className="icon-btn" onClick={recorder.cancel} aria-label="녹음 취소"><XIcon /></button>
      <button type="button" className="stop" onClick={async () => { const v = await recorder.stop(); if (v) onDone(v) }}>
        <StopIcon /> 정지
      </button>
    </div>
  )
}

export function AttachList({ items, onRemove }) {
  return items.map((a, i) => (
    <div key={a.url} className="attach-item">
      {a.kind === 'image' && (
        <div className="preview">
          <img src={a.url} alt="첨부 이미지" />
          <button type="button" className="remove" onClick={() => onRemove(i)} aria-label="이미지 삭제"><XIcon color="#fff" /></button>
        </div>
      )}
      {a.kind === 'voice' && (
        <div className="voice-attach">
          <VoicePlayer msg={{ src: a.url, duration: a.duration }} compact />
          <button type="button" className="icon-btn" onClick={() => onRemove(i)} aria-label="녹음 삭제"><XIcon /></button>
        </div>
      )}
      {a.kind === 'file' && <FileChip file={a} note="첨부됨" onRemove={() => onRemove(i)} />}
    </div>
  ))
}
