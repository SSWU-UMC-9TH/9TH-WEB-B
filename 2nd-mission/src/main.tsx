import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//여기서 index.css불러오기 떄문에 index에서 값을 넣어주면  main에서 모든 태그를 만들고 클래스 이름이 같다면 매칭시켜서 스타일 적용됨. 
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
