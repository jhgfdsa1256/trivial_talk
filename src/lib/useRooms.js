import { useEffect, useReducer, useRef } from 'react'
import { initialRooms, REPLIES, RANDOM_INCOMING } from './demo'
import { blobToDataURL } from './media'

const KEY = 'trivial_talk_rooms_v1'
const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || initialRooms() } catch { return initialRooms() }
}
const uid = () => Math.random().toString(36).slice(2, 10)

function reducer(rooms, a) {
  switch (a.type) {
    case 'add':
      return rooms.map((r) => r.id !== a.room ? r : {
        ...r,
        messages: [...r.messages, { id: uid(), at: Date.now(), ...a.msg }],
        unread: a.unread ? r.unread + 1 : r.unread,
      })
    case 'read':
      return rooms.map((r) => (r.id === a.room ? { ...r, unread: 0 } : r))
    case 'typing':
      return rooms.map((r) => (r.id === a.room ? { ...r, typing: a.who } : r))
    case 'reset':
      return initialRooms()
    default:
      return rooms
  }
}

// 채팅 데이터 (지금은 브라우저 localStorage, 나중에 Firebase 로 교체할 부분)
export function useRooms(openRoomId) {
  const [rooms, dispatch] = useReducer(reducer, null, load)
  const openRef = useRef(openRoomId)
  openRef.current = openRoomId

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(rooms.map(({ typing, ...r }) => ({
        ...r, messages: r.messages.map((m) => (m.src?.startsWith('blob:') ? { ...m, src: undefined, expired: true } : m)),
      }))))
    } catch { /* 저장 공간 초과 시 무시 */ }
  }, [rooms])

  // 가끔 다른 방에서 메시지가 도착 (실시간 흉내)
  useEffect(() => {
    let t
    const tick = () => {
      t = setTimeout(() => {
        const pick = RANDOM_INCOMING[Math.floor(Math.random() * RANDOM_INCOMING.length)]
        dispatch({ type: 'add', room: pick.room, unread: openRef.current !== pick.room, msg: { from: pick.from, type: 'text', text: pick.text } })
        tick()
      }, 25000 + Math.random() * 20000)
    }
    tick()
    return () => clearTimeout(t)
  }, [])

  const send = async (roomId, { text, attachments = [] }) => {
    for (const a of attachments) {
      let src = a.url
      if (a.blob && a.blob.size < 1.5 * 1024 * 1024) { try { src = await blobToDataURL(a.blob) } catch { /* keep blob url */ } }
      const type = a.kind === 'image' ? 'image' : a.kind
      dispatch({ type: 'add', room: roomId, msg: { from: 'me', type, src, name: a.name, size: a.size, duration: a.duration } })
    }
    if (text?.trim()) dispatch({ type: 'add', room: roomId, msg: { from: 'me', type: 'text', text: text.trim() } })

    // 상대방 답장
    const room = rooms.find((r) => r.id === roomId)
    const who = room.members[Math.floor(Math.random() * room.members.length)]
    setTimeout(() => dispatch({ type: 'typing', room: roomId, who }), 700)
    setTimeout(() => {
      dispatch({ type: 'typing', room: roomId, who: null })
      const list = REPLIES[roomId] || ['네!']
      dispatch({ type: 'add', room: roomId, unread: openRef.current !== roomId, msg: { from: who, type: 'text', text: list[Math.floor(Math.random() * list.length)] } })
    }, 2200 + Math.random() * 1200)
  }

  return {
    rooms,
    send,
    markRead: (room) => dispatch({ type: 'read', room }),
    reset: () => dispatch({ type: 'reset' }),
  }
}
