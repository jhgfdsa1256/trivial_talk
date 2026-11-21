import { DocIcon, XIcon } from '../lib/icons'
import { formatSize, resolveSrc } from '../lib/media'

export default function FileChip({ file, note, onRemove, download }) {
  const save = () => {
    const a = document.createElement('a')
    const real = file.src || file.url
    a.href = real || resolveSrc(file)
    a.download = real ? file.name : file.name + '.txt'
    a.click()
  }
  return (
    <div className="chip">
      <span className="ic"><DocIcon /></span>
      <div className="meta">
        {file.name}
        <small>{formatSize(file.size || 0)}{note ? ' · ' + note : ''}</small>
      </div>
      {onRemove && <button type="button" className="icon-btn" onClick={onRemove} aria-label="첨부 삭제"><XIcon /></button>}
      {download && <button type="button" className="mini-dl" onClick={save}>받기</button>}
    </div>
  )
}
