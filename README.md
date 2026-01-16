# Exchange App

USD/JPY 환전 서비스를 제공하는 웹 애플리케이션입니다.

## 주요 기능

- **사용자 인증**: 이메일 기반 로그인 시스템
- **환전 서비스**: USD(달러) 및 JPY(엔화) 환전 지원
  - 매수: 원화(KRW)로 외화 구매
  - 매도: 외화를 원화(KRW)로 판매
- **실시간 환율 정보**: 최신 환율 및 변동률 조회
- **지갑 관리**: 통화별 잔액 및 총 보유 자산 조회
- **환전 내역**: 과거 환전 거래 내역 조회

## 기술 스택

- **Frontend Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.18
- **Routing**: React Router DOM 7.12.0
- **HTTP Client**: ky 1.14.2
- **Icons**: React Icons 5.5.0

## 설치 및 실행

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버가 실행되면 브라우저에서 `http://localhost:5173` 로 접속할 수 있습니다.

### 프로덕션 빌드

```bash
npm run build
```

빌드 결과물은 `dist` 폴더에 생성됩니다.

### 빌드 미리보기

```bash
npm run preview
```

### 린트 검사

```bash
npm run lint
```

## 프로젝트 구조

```
exchange-app/
├── public/              # 정적 파일 (이미지 등)
├── src/
│   ├── api/            # API 호출 관련
│   │   ├── auth.ts     # 인증 API
│   │   ├── exchangeRates.ts  # 환율 및 환전 API
│   │   └── wallets.ts  # 지갑 API
│   ├── components/     # 재사용 가능한 컴포넌트
│   │   ├── container/  # 컨테이너 컴포넌트
│   │   ├── info/       # 환전 관련 컴포넌트
│   │   └── login/      # 로그인 관련 컴포넌트
│   ├── pages/          # 페이지 컴포넌트
│   │   ├── LoginPage.tsx
│   │   ├── InfoPage.tsx
│   │   └── HistrotyPage.tsx
│   ├── utils/          # 유틸리티 함수
│   ├── App.tsx         # 메인 앱 컴포넌트
│   └── main.tsx        # 엔트리 포인트
└── package.json
```

## 주요 기능 설명

### 1. 로그인

- 이메일을 입력하여 로그인
- 인증 토큰은 쿠키에 저장됨
- 로그인 후 환율 정보 및 지갑 정보 조회 가능

### 2. 환전

- USD 또는 JPY 선택 가능
- 매수(살래요): 원화로 외화 구매
- 매도(팔래요): 외화를 원화로 판매
- 실시간 환율 적용 및 필요 원화 금액 계산
- 환전 주문 시 환율 정보와 잔액 검증

### 3. 환율 정보

- 최신 환율 정보 자동 조회 (1분마다 갱신)
- 환율 변동률 표시
- USD와 JPY 환율 정보 제공

### 4. 지갑

- 보유 통화별 잔액 표시
  - KRW: 원화 형식
  - USD: 달러 형식 (소수점 2자리)
  - JPY: 엔화 형식
- 총 보유 자산을 원화 기준으로 표시

## 이슈

### 엔화 환율 표시 오류

**문제**: 환전 견적 조회 API(`/orders/quote`)에서 엔화(JPY) 환전 시 원화 금액(`krwAmount`)이 잘못된 값으로 응답되는 경우가 있습니다. 예를 들어, 엔화가 900원인데 API 응답에서 9원으로 나오는 문제가 발생합니다.

**위치**: `src/components/info/ExchangeForm.tsx` (148-156번째 줄)

**해결 방법**: API 응답의 `krwAmount` 값이 계산 값(`외화 금액 * 환율`)과 10% 이상 차이가 나는 경우, 계산 값을 사용하도록 우회 로직을 구현했습니다.

**현재 구현 코드**:
```typescript
// API 응답의 krwAmount가 잘못된 경우, appliedRate로 계산
// buy: 외화 금액 * 환율 = 필요한 KRW
// sale: 외화 금액 * 환율 = 받을 KRW
const calculatedKrwAmount = exchangeValue * quote.data.appliedRate;

// API 응답 값이 계산 값과 크게 다르면 계산 값 사용
const krwAmountToUse = Math.abs(quote.data.krwAmount - calculatedKrwAmount) > calculatedKrwAmount * 0.1 
    ? calculatedKrwAmount 
    : quote.data.krwAmount;
```

이 로직을 통해 API에서 잘못된 값이 응답되더라도 클라이언트 측에서 올바른 환전 금액을 계산하여 표시합니다.