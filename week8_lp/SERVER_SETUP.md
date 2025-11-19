# 🔧 서버 세팅 가이드

## 환경 변수 설정 (.env 파일)

프로젝트 루트에 `.env` 파일을 생성하고 아래 내용을 추가하세요:

```env
# API 서버 URL
VITE_SERVER_API_URL=http://localhost:8000

# 서버에서 제공하는 Google OAuth Client ID (서버 측에서 필요)
# 클라이언트에서는 필요없을 수 있음
```

## 테스트를 위한 토큰 만료 시간 조정

서버 코드에서 아래와 같이 토큰 만료 시간을 짧게 설정하여 테스트할 수 있습니다:

```typescript
// 서버 코드 예시 (실제 서버 코드에서 수정)
const accessTokenExpiry = '30s';  // 30초
const refreshTokenExpiry = '1m';   // 1분
```

## 동작 확인 체크리스트

1. ✅ 로그인 시 accessToken과 refreshToken이 localStorage에 저장됨
2. ✅ 인증이 필요한 페이지(/my)는 로그인하지 않으면 접근 불가
3. ✅ accessToken 만료 시 자동으로 refreshToken으로 갱신
4. ✅ refreshToken도 만료되면 로그인 페이지로 리다이렉트
5. ✅ 무한 루프 없이 정상 동작

## 문제 해결

### 401 Unauthorized 오류가 계속 발생하는 경우

1. 브라우저 콘솔(F12)에서 다음을 확인:
   - `🔐 로그인 응답 전체:` 로그에서 토큰이 정상적으로 받아와지는지
   - `🔑 API 요청 - 토큰:` 로그에서 요청 시 토큰이 포함되는지

2. localStorage 확인:
   ```javascript
   // 브라우저 콘솔에서 실행
   console.log(localStorage.getItem('accessToken'));
   console.log(localStorage.getItem('refreshToken'));
   ```

3. 서버 응답 구조 확인:
   - Swagger UI에서 로그인 API 응답 구조 확인
   - `data.data.accessToken` 경로가 맞는지 확인

### 토큰 갱신이 동작하지 않는 경우

1. 서버에 `/v1/auth/token` API가 구현되어 있는지 확인
2. refreshToken을 body에 담아서 POST 요청하는지 확인
3. 콘솔에서 `🔄 토큰 갱신 시도...` 로그 확인
