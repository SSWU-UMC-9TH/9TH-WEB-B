# ✅ Week4 미션 체크리스트

## Protected Route
- [x] Swagger를 확인 후, Token이 필요한 (자물쇠가 걸린) API에만 방문할 수 있는 페이지인 경우 `ProtectedLayout`을 활용해 경로를 보호
- [x] `/my` 경로는 ProtectedLayout으로 보호됨

## 리다이렉트 처리
- [x] 사용자가 로그인하지 않은 경우, 인증이 필요한 페이지에 접근 시 로그인 페이지로 Redirect
- [x] `ProtectedLayout`에서 자동 리다이렉트 처리

## 서버 세팅
- [ ] `SERVER_SETUP.md` 문서를 참고하여 서버 세팅 완료
- [ ] `.env` 파일에 `VITE_SERVER_API_URL` 설정

## 토큰 갱신 로직
- [x] Access Token 만료 시, Axios의 응답 인터셉터를 활용하여 Refresh Token으로 새로운 Access Token을 발급
- [x] 실패한 요청을 재시도하는 로직 구현 (`auth.ts`의 response interceptor)
- [x] 토큰 갱신 API: `/v1/auth/token`

## 무한 루프 방지
- [x] `isRefreshing` 플래그 사용하여 무한 재시도 방지
- [x] `failedQueue`로 동시 요청 관리
- [x] `_retry` 플래그로 이미 재시도한 요청은 다시 시도하지 않음

## 동작 검증
- [ ] 서버 토큰 시간을 임의로 짧게 조정(30초)하여 토큰 재발급이 정상 동작하는지 테스트
- [ ] 서비스를 끊김 없이 이용할 수 있는지 확인

## Google Login (선택)
- [ ] Google API Console 설정 완료
- [ ] Client ID 발급 및 환경변수 설정
- [ ] Redirect URI 설정
- [ ] 소셜 로그인 동작 확인

---

## 📁 주요 파일 구조

```
src/
├── apis/
│   └── auth.ts              # axios 인터셉터 + 토큰 갱신 로직
├── layouts/
│   └── ProtectedLayout.tsx  # 인증 필요한 라우트 보호
├── context/
│   └── AuthContext.tsx      # 로그인/로그아웃 상태 관리
├── pages/
│   ├── LoginPage.tsx        # 로그인 페이지
│   ├── SignupPage.tsx       # 회원가입 페이지
│   └── MyPage.tsx           # 마이페이지 (인증 필요)
└── App.tsx                  # 라우터 설정
```

## 🔍 디버깅 방법

1. 브라우저 콘솔(F12) 열기
2. 로그인 후 아래 로그 확인:
   - `🔐 로그인 응답 전체:` - 서버 응답 구조 확인
   - `✅ AccessToken:` - 토큰 저장 여부 확인
   - `💾 localStorage 저장 확인:` - localStorage 저장 확인
   - `🔑 API 요청 - 토큰:` - API 요청 시 토큰 포함 여부
   - `🔄 토큰 갱신 시도...` - 토큰 갱신 동작 확인

3. localStorage 직접 확인:
   ```javascript
   localStorage.getItem('accessToken')
   localStorage.getItem('refreshToken')
   ```

## 🚨 현재 발생 중인 401 에러 해결 방법

401 Unauthorized 에러가 발생하는 경우:

1. **서버 응답 구조 확인**: Swagger UI에서 로그인 API 응답 구조를 확인하세요
2. **콘솔 로그 확인**: `🔐 로그인 응답 전체:` 로그를 보고 실제 응답 구조 파악
3. **토큰 경로 수정**: 만약 `response.data.accessToken`이 아니라 다른 경로라면 `AuthContext.tsx`의 login 함수 수정

예시:
```typescript
// 만약 응답이 { accessToken: "...", refreshToken: "..." } 형태라면:
const newAccessToken = response.accessToken;
const newRefreshToken = response.refreshToken;

// 만약 응답이 { data: { data: { accessToken: "..." } } } 형태라면:
const newAccessToken = response.data.data.accessToken;
const newRefreshToken = response.data.data.refreshToken;
```
