import { demoImage } from './media'

export const DEMO_PASSWORD = '1212'
export const ME = { id: 'me', name: '민준' }

export const PEOPLE = {
  me: { name: '민준', color: '#c9b8a8' },
  jisu: { name: '지수', color: '#e7a59b' },
  seoyeon: { name: '서연', color: '#9fb7d9' },
  doyun: { name: '도윤', color: '#a9c99b' },
  hajun: { name: '하준', color: '#d2b07a' },
  mom: { name: '엄마', color: '#c7a3d1' },
  hayun: { name: '하윤', color: '#8ec5c0' },
}

const now = Date.now()
const ago = (min) => now - min * 60 * 1000
let seq = 0
const m = (from, min, body) => ({ id: 'd' + seq++, from, at: ago(min), type: 'text', ...body })

export const initialRooms = () => [
  {
    id: 'jisu', name: '지수', members: ['jisu'], unread: 2,
    messages: [
      m('jisu', 95, { text: '민준아 내일 시간 돼?' }),
      m('me', 90, { text: '응 점심은 괜찮아' }),
      m('jisu', 12, { text: '그럼 12시에 회사 앞에서 보자' }),
      m('jisu', 11, { text: '국밥 어때?' }),
    ],
  },
  {
    id: 'study', name: '개발 스터디', members: ['seoyeon', 'doyun', 'hajun'], unread: 5,
    messages: [
      m('doyun', 300, { text: '이번 주 발표 자료 올립니다' }),
      m('doyun', 299, { type: 'file', name: '회의자료.pdf', size: 2.4 * 1024 * 1024 }),
      m('seoyeon', 240, { type: 'voice', duration: 6, text: '' }),
      m('hajun', 60, { text: '저 오늘 조금 늦어요!' }),
      m('me', 55, { text: '넵 천천히 오세요' }),
      m('seoyeon', 30, { type: 'image', src: demoImage('#bfe3ff', '#c8b6ff') }),
      m('seoyeon', 29, { text: '오늘 화이트보드 정리한 거예요' }),
    ],
  },
  {
    id: 'mom', name: '엄마', members: ['mom'], unread: 0,
    messages: [
      m('mom', 600, { text: '밥은 먹었니?' }),
      m('me', 590, { text: '네 먹었어요' }),
      m('mom', 589, { type: 'voice', duration: 4 }),
    ],
  },
  {
    id: 'hayun', name: '하윤', members: ['hayun'], unread: 0,
    messages: [
      m('hayun', 2880, { type: 'image', src: demoImage() }),
      m('hayun', 2879, { text: '여기 노을 진짜 예뻤어' }),
      m('me', 2870, { text: '우와 어디야?' }),
    ],
  },
]

// 상대방 자동 답장 (실시간 채팅 흉내)
export const REPLIES = {
  jisu: ['좋아!', 'ㅋㅋㅋ 알겠어', '그럼 내일 봐', '오 그거 좋다'],
  study: ['확인했습니다!', '좋네요', '다음 주에 같이 봐요', '자료 감사합니다'],
  mom: ['그래 알았다', '조심히 다니고', '주말에 집에 오니?'],
  hayun: ['다음에 같이 가자', 'ㅎㅎ 사진 더 보내줄게', '응응'],
}

export const RANDOM_INCOMING = [
  { room: 'jisu', from: 'jisu', text: '혹시 지금 통화 가능?' },
  { room: 'study', from: 'hajun', text: '오늘 스터디 장소 바뀌었어요' },
  { room: 'study', from: 'doyun', text: '코드 리뷰 부탁드려요' },
  { room: 'mom', from: 'mom', text: '반찬 보냈다' },
  { room: 'hayun', from: 'hayun', text: '이번 주말에 뭐해?' },
]
