# Yona Issue Tracker

Yona Issue Tracker는 NestJS 백엔드와 React 프론트엔드를 사용하여 구축된 이슈 추적 시스템입니다.

## 기능

- 사용자 인증 (회원가입, 로그인, 로그아웃)
- JWT 기반 인증
- 사용자 프로필 관리
- 이슈 생성 및 관리 (개발 예정)

## 기술 스택

### 백엔드
- NestJS
- MySQL
- Passport.js (JWT 전략)

### 프론트엔드
- React
- TypeScript
- Tailwind CSS
- Axios

## 시작하기

### 사전 요구사항
- Node.js
- MySQL
- node 18.16.0
### 설치

1. 저장소 클론:
   ```
   git clone https://github.com/luxury515/yona-puls-for-nestjs.git
   cd yona-puls-for-nestjs
   ```

2. 백엔드 설정:
   ```
   cd backend
   npm install
   ```

3. 프론트엔드 설정:
   ```
   cd frontend
   npm install
   ```

4. 환경 변수 설정:
   - 백엔드: `.env` 파일을 생성하고 필요한 환경 변수 설정 (예: DB_HOST, DB_USER, DB_PASSWORD, JWT_SECRET)
   - 프론트엔드: `.env` 파일을 생성하고 `REACT_APP_API_URL`을 백엔드 URL로 설정

### 실행

1. 백엔드 실행:
   ```
   cd backend
   npm run start:dev
   ```

2. 프론트엔드 실행:
   ```
   cd frontend
   npm start
   ```

## API 문서

API 엔드포인트와 사용법은 `backend/test/restapi.http` 파일에서 확인할 수 있습니다.

## 기여

프로젝트에 기여하고 싶으시다면 pull request를 보내주세요. 주요 변경사항의 경우, 먼저 이슈를 열어 논의해 주시기 바랍니다.

## 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE)하에 있습니다.