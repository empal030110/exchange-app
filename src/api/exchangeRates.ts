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


