import { Button } from "../Button";

export function LoginForm() {
    return (
        <div className="w-full max-w-[560px] py-[24px] px-[32px] bg-[#F7F8F9] rounded-[20px] border border-gray-300">
            <div className="font-medium text-[20px] text-[#646F7C]">이메일 주소를 입력해주세요.</div>
            <div className="mt-[12px] mb-[32px]">
                <input className="w-full text-[##646F7C] rounded-[12px] p-[24px] bg-white border border-[#374553] font-semibold" placeholder="test@test.com" />
            </div>
            <div>
                <Button txt="로그인 하기" />
            </div>
        </div>
    )
}