import ky from "ky"

type LoginSuccessResponse = {
  code: string
  message: string
  data: {
    memberId: number
    token: string
  }
}

// Vite dev 서버의 프록시(/auth → https://exchange-example.switchflow.biz/auth)를 사용
const api = ky.create({
  prefixUrl: "/",
})

export async function login(email: string): Promise<LoginSuccessResponse> {
  const response = await api.post("auth/login", {
    searchParams: { email },
  })

  return response.json<LoginSuccessResponse>()
}