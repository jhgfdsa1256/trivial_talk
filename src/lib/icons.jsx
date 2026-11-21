// 모든 아이콘은 이모지 대신 SVG로 그립니다.
const base = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }

export const TalkLogo = ({ big }) => <span className={'logo' + (big ? ' big' : '')}>TALK</span>

export const ImageIcon = ({ size = 18, color = '#2f7de1' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth="2.2" {...base}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="8.5" cy="8.5" r="1.8" fill={color} />
    <path d="M21 15l-5-5L5 21" />
  </svg>
)

export const MicIcon = ({ size = 18, color = '#e5484d' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth="2.2" {...base}>
    <rect x="9" y="2" width="6" height="12" rx="3" fill={color} />
    <path d="M5 11a7 7 0 0 0 14 0" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="8" y1="22" x2="16" y2="22" />
  </svg>
)

export const ClipIcon = ({ size = 18, color = '#555' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth="2.2" {...base}>
    <path d="M21.4 11.1l-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5" />
  </svg>
)

export const DocIcon = ({ size = 20, color = '#555' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth="2" {...base}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="13" y2="17" />
  </svg>
)

export const XIcon = ({ size = 18, color = '#888' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth="2.4" {...base}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export const StopIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12"><rect width="12" height="12" rx="2" fill="#fff" /></svg>
)

// 정중앙에서 약 1px 오른쪽 (시각적 중앙)
export const PlayIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <path transform="translate(-1 0)" d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.8l-12-7.5A1 1 0 0 0 7 4.5z" fill="#fff" />
  </svg>
)

export const PauseIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <rect x="6" y="4.5" width="4" height="15" rx="1.2" fill="#fff" />
    <rect x="14" y="4.5" width="4" height="15" rx="1.2" fill="#fff" />
  </svg>
)

export const BackIcon = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth="2.4" {...base}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

export const SendIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth="2.2" {...base}>
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4z" />
  </svg>
)

export const ChatIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth="2.2" {...base}>
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12z" />
  </svg>
)

export const KakaoBubble = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.7 6.7l-.9 3.4c-.1.3.3.6.6.4l4-2.7c.5.1 1.1.1 1.6.1 5.5 0 10-3.6 10-8S17.5 3 12 3z" fill="#191919" />
  </svg>
)
