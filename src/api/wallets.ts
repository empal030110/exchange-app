import ky from "ky"
import { getAccessTokenCookie } from "../utils/authToken"

export type WalletItem = {
  walletId: number,
  currency: string,
  balance: number,
}

export type WalletsResponse = {
  code: string,
  message: string,
  data: {
    totalKrwBalance: number,
    wallets: WalletItem[],
  }
}

const api = ky.create({
  prefixUrl: "/",
})

export async function fetchWallets(): Promise<WalletsResponse> {
  const token = getAccessTokenCookie();

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 다시 로그인 해주세요.");
  }

  const response = await api.get("wallets", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.json<WalletsResponse>();
}
