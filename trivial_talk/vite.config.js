import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // 상대 경로로 빌드 → 저장소 이름이 무엇이든 GitHub Pages에서 동작
  base: './',
})
