import { PageContainer } from "../components/container/PageContainer";
import { SiRss } from "react-icons/si";
import { LoginForm } from "../components/login/LoginForm";

export function LoginPage() {
    return (
        <PageContainer>
            <div className="w-full h-full flex flex-col items-center justify-center gap-[48px]">
                <div className="flex flex-col items-center">
                    <div className="mb-[24px]"><SiRss size={50} color="blue" /></div>
                    <div className="font-bold text-[48px] text-[#374553] mb-[8px]">반갑습니다.</div>
                    <div className="font-medium text-[32px] text-[#646F7C]">로그인 정보를 입력해주세요.</div>
                </div>
                <LoginForm />
            </div>
        </PageContainer>
    )
}