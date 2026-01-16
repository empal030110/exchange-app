import ky from "ky"
import { getAccessTokenCookie } from "../utils/authToken"

export type ExchangeRateItem = {
  exchangeRateId: number,
  currency: string,
  rate: number,
  changePercentage: number,
  applyDateTime: string,
}

export type LatestExchangeRatesResponse = {
  code: string,
  message: string,
  data: ExchangeRateItem[],
}

const api = ky.create({
  prefixUrl: "/",
})

export async function fetchLatestExchangeRates(): Promise<LatestExchangeRatesResponse> {
  const token = getAccessTokenCookie();

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 다시 로그인 해주세요.");
  }

  const response = await api.get("exchange-rates/latest", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json<LatestExchangeRatesResponse>();
}

export type ExchangeQuoteRequest = {
  fromCurrency: string;
  toCurrency: string;
  forexAmount: number;
}

export type ExchangeQuoteResponse = {
  code: string;
  message: string;
  data: {
    krwAmount: number;
    appliedRate: number;
  };
}

export async function fetchExchangeQuote(
  request: ExchangeQuoteRequest
): Promise<ExchangeQuoteResponse> {
  const token = getAccessTokenCookie();

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 다시 로그인 해주세요.");
  }

  try {
    const response = await api.get("orders/quote", {
      searchParams: {
        fromCurrency: request.fromCurrency,
        toCurrency: request.toCurrency,
        forexAmount: request.forexAmount.toString(),
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json<ExchangeQuoteResponse>();
  } catch (error) {
    // HTML 응답이 오는 경우
    if (error instanceof Error && error.message.includes('JSON')) {
      throw new Error("서버 응답 오류가 발생했습니다.");
    }
    throw error;
  }
}

export type ExchangeOrderRequest = {
  exchangeRateId: number;
  fromCurrency: string;
  toCurrency: string;
  forexAmount: number;
}

export type ExchangeOrderResponse = {
  code: string;
  message: string;
  data: string;
}

export async function createExchangeOrder(
  request: ExchangeOrderRequest
): Promise<ExchangeOrderResponse> {
  const token = getAccessTokenCookie();

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 다시 로그인 해주세요.");
  }

  const response = await api.post("orders", {
    json: request,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json<ExchangeOrderResponse>();
}


