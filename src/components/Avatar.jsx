import { PEOPLE } from '../lib/demo'

export default function Avatar({ id, size = 34 }) {
  const p = PEOPLE[id] || { name: '?', color: '#bbb' }
  const style = { width: size, height: size, background: p.color, fontSize: size * 0.4 }
  if (p.image) return <img className="avatar" src={p.image} alt={p.name} style={style} referrerPolicy="no-referrer" />
  return <div className="avatar" style={style}>{p.name[0]}</div>
}

export function GroupAvatar({ ids, size = 46 }) {
  if (ids.length === 1) return <Avatar id={ids[0]} size={size} />
  const s = size * 0.62
  return (
    <div className="group-avatar" style={{ width: size, height: size }}>
      {ids.slice(0, 2).map((id, i) => (
        <div key={id} style={{ position: 'absolute', left: i ? size - s : 0, top: i ? size - s : 0 }}>
          <Avatar id={id} size={s} />
        </div>
      ))}
    </div>
  )
}
