import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../Button";
import { login } from "../../api/auth";
import { setAccessTokenCookie } from "../../utils/authToken";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // 공백이 아닌 이메일만 허용
  const isEmailValid = email.trim().length > 0;

  const handleLogin = async () => {
    // 중복 요청 방지
    if (!isEmailValid || isLoading) return;

    try {
      setIsLoading(true)
      setError(null)

      const res = await login(email.trim())

      if (res.code !== "OK" || !res.data?.token) {
        throw new Error("invalid login response")
      }

      // 로그인 성공 시 쿠키에 저장
      setAccessTokenCookie(res.data.token)
      navigate("/info");
    } catch (err) {
      console.error(err);
      setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[560px] py-[24px] px-[32px] bg-[#F7F8F9] rounded-[20px] border border-gray-300">
      <div className="font-medium text-[20px] text-[#646F7C]">이메일 주소를 입력해주세요.</div>

      <div className="mt-[12px] mb-[32px]">
        <input
          className="w-full rounded-[12px] p-[24px] bg-white border border-[#374553] font-semibold text-[#374553]"
          placeholder="test@test.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              void handleLogin();
            }
          }}
        />
      </div>

      {error && (
        <div className="mb-[8px] text-[14px] text-red-500 font-medium">
          {error}
        </div>
      )}

      <div>
        <Button
          txt={isLoading ? "로그인 중..." : "로그인 하기"}
          onClick={() => { void handleLogin(); }}
          disabled={!isEmailValid || isLoading}
        />
      </div>
    </div>
  )
}