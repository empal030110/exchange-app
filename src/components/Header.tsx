import { SiRss } from "react-icons/si";
import { useLocation, useNavigate } from "react-router-dom";
import { clearAccessTokenCookie } from "../utils/authToken";

export function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const pageMove = (url: string) => {
        navigate(url);
    }

    const LogOut = () => {
        clearAccessTokenCookie();
        navigate('/');
    }

    return (
        <div className="flex items-center justify-between py-[16px] px-[40px] border-b border-[#D0D6DB]">
            <div className="flex gap-[8px] items-center justify-center">
                <SiRss size={20} color="blue" />
                <p className="font-bold text-[24px]">Exchange app</p>
            </div>
            <div className="flex gap-[40px] items-center justify-center text-[20px]">
                <p className={`cursor-pointer ${location.pathname === '/info' ? 'text-#36414C font-bold' : 'text-[#8899AA] font-medium'}`} onClick={() => { pageMove('/info'); }}>환전 하기</p>
                <p className={`cursor-pointer ${location.pathname === '/history' ? 'text-#36414C font-bold' : 'text-[#8899AA] font-medium'}`} onClick={() => { pageMove('/history'); }}>환전 내역</p>
                <div className="bg-[#3479EB] rounded-[12px] py-[8px] px-[12px] font-semibold text-white cursor-pointer" onClick={() => { LogOut() }}>Log out</div>
            </div>
        </div>
    )
}