import { useState, useEffect } from "react"
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { Button } from "../Button";
import { fetchExchangeQuote } from "../../api/exchangeRates";

export function ExchangeForm({ usdRate, jpyRate }: { usdRate: number, jpyRate: number }) {
    const [country, setCountry] = useState('usd');
    const [arrow, setArrow] = useState('down');
    const [exchange, setExchange] = useState('buy');
    const [exchangeValue, setExchangeValue] = useState<number>(1);
    const [krwAmount, setKrwAmount] = useState<number | null>(null);
    const [appliedRate, setAppliedRate] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const clickArrow = () => {
        if (arrow === 'down') {
            setArrow('up');
        } else {
            setArrow('down');
        }
    };

    const clickCountry = () => {
        if (country === 'usd') {
            setCountry('jpy');
            clickArrow();
        } else {
            setCountry('usd');
            clickArrow();
        }
    };

    const clickExchange = () => {
        if (exchange === 'buy') {
            setExchange('sale');
        } else {
            setExchange('buy');
        }
    }

    const handleExchange = () => {
        alert('환전');
    }

    useEffect(() => {
        const fetchQuote = async () => {
            if (exchangeValue <= 0 || !exchangeValue) {
                setKrwAmount(null);
                setAppliedRate(null);
                return;
            }

            setIsLoading(true);
            try {
                const currency = country === 'usd' ? 'USD' : 'JPY';
                const quote = await fetchExchangeQuote({
                    fromCurrency: currency,
                    toCurrency: 'KRW',
                    forexAmount: exchangeValue,
                });
                setKrwAmount(quote.data.krwAmount);
                setAppliedRate(quote.data.appliedRate);
            } catch (error) {
                console.error('견적 조회 실패:', error);
                setKrwAmount(null);
                setAppliedRate(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuote();
    }, [exchangeValue, country, exchange]);

    return (
        <div>
            {/* 환전 헤더 */}
            <div className="relative flex gap-[8px] items-center">
                <img src={`/${country}.png`} alt={`${country === 'usd' ? '미국' : '일본'}`} className="w-[30px] h-[30px] rounded-full" />
                <div>
                    <p className="text-[#36414C] text-[20px] font-bold">{country === 'usd' ? 'USD' : 'JPY'} 환전하기</p>
                </div>
                <div>
                    <p onClick={() => {clickArrow()}} className="cursor-pointer">{arrow === 'down' ? <IoIosArrowDown size={20} /> : <IoIosArrowUp size={20} />}</p>
                </div>
                <div className={`absolute top-[calc(100%+8px)] w-full max-w-[140px] bg-white py-[8px] border border-[#E9EBEE] rounded-[12px] ${arrow === 'down' ? 'hidden' : 'block'}`}>
                    <div className={`flex gap-[12px] items-center py-[12px] px-[16px] ${country === 'usd' ? 'cursor-not-allowed bg-[#F7F8FA]' : 'cursor-pointer'}`} onClick={() => {clickCountry()}}>
                        <img src="/usd.png" alt="미국 USD" className="w-[20px] h-[20px] rounded-full" />
                        <p>미국 USD</p>
                    </div>
                    <div className={`flex gap-[12px] items-center py-[12px] px-[16px] ${country === 'jpy' ? 'cursor-not-allowed bg-[#F7F8FA]' : 'cursor-pointer'}`} onClick={() => {clickCountry()}}>
                        <img src="/jpy.png" alt="일본 JPY" className="w-[20px] h-[20px] rounded-full" />
                        <p>일본 JPY</p>
                    </div>
                </div>
            </div>

            {/* 환전 스위치 */}
            <div className="w-full p-[12px] flex gap-[12px] bg-white border border-[#D0D6DB] rounded-[16px] mt-[16px]">
                <p className={`w-full flex items-center justify-center p-[16px] cursor-pointer font-bold text-[20px] rounded-[12px] ${exchange === 'buy' ? 'text-white bg-[#FE5050]' : 'text-[#FFA7A7]'}`} onClick={() => {clickExchange()}}>살래요</p>
                <p className={`w-full flex items-center justify-center p-[16px] cursor-pointer font-bold text-[20px] rounded-[12px] ${exchange === 'sale' ? 'text-white bg-[#3479EB]' : 'text-[#9DB6FF]'}`} onClick={() => {clickExchange()}}>팔래요</p>
            </div>

            {/* 매수/도 금액 */}
            <div className="flex flex-col gap-[12px] mt-[32px] text-[#646F7C]">
                <p className="font-medium text-[20px]">{exchange === 'buy' ? '매수' : '매도'} 금액</p>
                <div className="w-full bg-white border border-[#374553] rounded-[12px] p-[24px] flex gap-[10px]">
                    <input 
                        type="number"
                        min="1"
                        className="w-[calc(100%-84px)] text-right outline-0 text-[20px] font-semibold"
                        value={exchangeValue}
                        onChange={(e) => setExchangeValue(Number(e.target.value))}
                    />
                    <p className="font-medium text-[20px]">{country === 'usd' ? '달러' : '엔'} {exchange === 'buy' ? '사기' : '팔기'}</p>
                </div>
            </div>

            <div className="w-full flex items-center justify-center">
                <div className="my-[16px] w-[40px] h-[40px] rounded-full bg-[#D0D6DB] flex items-center justify-center">
                    <IoIosArrowDown size={30} color="white" />
                </div>
            </div>

            {/* 필요 원화 */}
            <div className="flex flex-col gap-[12px]">
                <p className="text-[#646F7C] text-[20px] font-medium">필요 원화</p>
                <div className="w-full flex gap-[10px] items-center justify-end bg-[#F1F2F4] border border-[#ACB4BB] rounded-[12px] p-[24px]">
                    <p className="text-[#646F7C] font-semibold text-[20px]">
                        {isLoading ? '조회 중...' : krwAmount !== null ? krwAmount.toLocaleString() : '-'}
                    </p>
                    <p className={`font-bold text-[20px] ${exchange === 'buy' ? 'text-[#FE5050]' : 'text-[#3479EB]'}`}>원 {exchange === 'buy' ? '필요해요' : '받을 수 있어요'}</p>
                </div>
            </div>

            {/* 환전 버튼 */}
            <div className="flex flex-col gap-[32px] mt-[108px] border-t border-[#C5C8CE] pt-[32px]">
                <div className="w-full flex items-center justify-between text-[#646F7C] text-[20px]">
                    <p className="font-medium">적용 환율</p>
                    <p className="font-semibold">1 {country === 'usd' ? 'USD' : 'JPY'} = { appliedRate !== null ? appliedRate.toLocaleString() : (country === 'usd' ? usdRate.toLocaleString() : jpyRate.toLocaleString())} 원</p>
                </div>
                <div>
                    <Button
                        txt={'환전하기'}
                        onClick={() => { void handleExchange(); }}
                        disabled={false}
                    />
                </div>
            </div>
        </div>
    )
}