# 🚀 웹 서버 구동 가이드

## 빠른 시작

### 1. 개발 모드로 웹 서버만 시작
```bash
./start-web.sh
```
- Next.js 개발 서버를 `http://localhost:3000`에서 실행합니다
- 핫 리로드(Hot Reload)가 활성화됩니다
- 코드 변경 시 자동으로 새로고침됩니다

### 2. 프로덕션 모드로 웹 서버 시작
```bash
./start-web-prod.sh
```
- 애플리케이션을 빌드하고 프로덕션 모드로 실행합니다
- 최적화된 번들로 실행됩니다

### 3. 전체 스택 시작 (Docker Compose)
```bash
./start-all.sh
```
- Nginx, Web, API 서버를 모두 시작합니다
- Docker Compose를 사용하여 모든 서비스를 컨테이너로 실행합니다
- 백그라운드 실행: `docker-compose up -d`

### 4. 모든 서비스 중지
```bash
./stop-all.sh
```
- 실행 중인 모든 Docker 컨테이너를 중지합니다

## 수동 실행

### 개발 모드
```bash
cd apps/web
npm install
npm run dev
```

### 프로덕션 빌드 및 실행
```bash
cd apps/web
npm install
npm run build
npm run start
```

## 환경 변수 설정

웹 서버를 실행하기 전에 `.env` 파일을 설정해야 합니다:

```env
NEXT_PUBLIC_API_URL=http://localhost:80/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

## 포트 정보

- **웹 서버 (개발)**: http://localhost:3000
- **웹 서버 (프로덕션)**: http://localhost:3000
- **API 서버**: http://localhost:80/api
- **Nginx**: http://localhost:80

## 문제 해결

### 포트가 이미 사용 중인 경우
```bash
# 포트를 사용하는 프로세스 확인
lsof -i :3000

# 프로세스 종료
kill -9 <PID>
```

### node_modules 재설치
```bash
cd apps/web
rm -rf node_modules package-lock.json
npm install
```

### Docker 완전 초기화
```bash
docker-compose down -v
docker-compose up --build
```

## 개발 팁

1. **자동 재시작**: 개발 모드에서는 파일 변경 시 자동으로 재시작됩니다
2. **타입 체크**: `npm run type-check` (스크립트 추가 필요)
3. **린트**: `npm run lint`
4. **로그 확인**: `docker-compose logs -f web`
