import { useEffect, useRef, useState } from 'react'
import { PlayIcon, PauseIcon } from '../lib/icons'
import { formatDur, resolveSrc } from '../lib/media'

export default function VoicePlayer({ msg, compact }) {
  const audio = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(0)
  const [src] = useState(() => resolveSrc(msg))
  const total = msg.duration || 0

  useEffect(() => () => audio.current?.pause(), [])

  const toggle = () => {
    const a = audio.current
    if (!a) return
    if (a.paused) a.play().catch(() => alert('재생할 수 없는 파일이에요.'))
    else a.pause()
  }

  return (
    <div className={'player-box' + (compact ? ' compact' : '')}>
      <button type="button" className="pbtn" onClick={toggle} aria-label={playing ? '일시정지' : '재생'}>
        {playing ? <PauseIcon size={compact ? 16 : 20} /> : <PlayIcon size={compact ? 16 : 20} />}
      </button>
      <div className="bar"><b style={{ width: total ? Math.min(100, (pos / total) * 100) + '%' : 0 }} /></div>
      <span className="time">{formatDur(pos)} / {formatDur(total)}</span>
      <audio
        ref={audio}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setPos(0) }}
        onTimeUpdate={(e) => setPos(e.target.currentTime)}
      />
    </div>
  )
}
