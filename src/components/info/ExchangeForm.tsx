import { useState, useEffect } from "react"
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { Button } from "../Button";
import { fetchExchangeQuote, createExchangeOrder, type ExchangeRateItem } from "../../api/exchangeRates";
import { HTTPError } from "ky";

export function ExchangeForm({ usdRate, jpyRate, rates, onExchangeSuccess }: { usdRate: number, jpyRate: number, rates: ExchangeRateItem[], onExchangeSuccess: () => void }) {
    const [country, setCountry] = useState('usd');
    const [arrow, setArrow] = useState('down');
    const [exchange, setExchange] = useState('buy');
    const [exchangeValue, setExchangeValue] = useState<number>(1);
    const [krwAmount, setKrwAmount] = useState<number | null>(null);
    const [appliedRate, setAppliedRate] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isExchanging, setIsExchanging] = useState(false);

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

    // 환전 실행 함수
    const handleExchange = async () => {
        if (exchangeValue <= 0 || !exchangeValue) {
            alert('환전 금액을 입력해주세요.');
            return;
        }

        // 선택한 나라 환율 정보 조회
        const currency = country === 'usd' ? 'USD' : 'JPY';
        const rateItem = rates.find(r => r.currency === currency);
        
        if (!rateItem) {
            alert('환율 정보를 찾을 수 없습니다.');
            return;
        }

        setIsExchanging(true);
        
        try {
            // buy(살래요): KRW -> currency (원화로 외화 매수)
            // sale(팔래요): currency -> KRW (외화를 원화로 매도)
            const fromCurrency = exchange === 'buy' ? 'KRW' : currency;
            const toCurrency = exchange === 'buy' ? currency : 'KRW';

            // 환전 주문 요청
            await createExchangeOrder({
                exchangeRateId: rateItem.exchangeRateId,
                fromCurrency,
                toCurrency,
                forexAmount: exchangeValue,
            });

            onExchangeSuccess();
            alert('환전이 완료되었습니다.');
        } catch (error) {
            // HTTP 에러인 경우 상세 에러 처리
            if (error instanceof HTTPError) {
                try {
                    const body = await error.response.json<{ code: string; message: string }>();
                    
                    // 도메인 에러 코드별 표시
                    let errorMessage = body.message || '환전에 실패했습니다.';
                    
                    switch (body.code) {
                        case 'WALLET_INSUFFICIENT_BALANCE':
                            errorMessage = '지갑의 잔액이 부족합니다.';
                            break;
                        case 'INVALID_AMOUNT_SCALE':
                            errorMessage = body.message || '금액의 소수점 자릿수가 올바르지 않습니다.';
                            break;
                        case 'EXCHANGE_RATE_CURRENCY_MISMATCH':
                            errorMessage = body.message || '환율 정보와 환전하려는 통화가 일치하지 않습니다.';
                            break;
                        case 'UNSUPPORTED_FOREX_CONVERSION_CURRENCY':
                            errorMessage = body.message || '외화 간 직접 변환은 지원하지 않습니다.';
                            break;
                        case 'INVALID_EXCHANGE_RATE_CURRENCY':
                            errorMessage = body.message || '환율 정보의 통화가 올바르지 않습니다.';
                            break;
                        case 'UNSUPPORTED_CURRENCY_FOR_KRW_CONVERSION':
                            errorMessage = body.message || '원화 변환은 KRW 통화만 지원합니다.';
                            break;
                        default:
                            errorMessage = body.message || '환전에 실패했습니다.';
                    }
                    
                    alert(errorMessage);
                } catch {
                    alert('환전에 실패했습니다.');
                }
            } else {
                // HTTP 에러가 아닐 때
                console.error('환전 실패:', error);
                alert('환전에 실패했습니다.');
            }
        } finally {
            setIsExchanging(false);
        }
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
                
                // buy(살래요): 외화를 사기 위해 필요한 KRW 조회
                // sale(팔래요): 외화를 팔아서 받을 KRW 조회
                const fromCurrency = exchange === 'buy' ? 'KRW' : currency;
                const toCurrency = exchange === 'buy' ? currency : 'KRW';
                // forexAmount는 항상 외화 금액
                const forexAmount = exchangeValue;
                
                const quote = await fetchExchangeQuote({
                    fromCurrency,
                    toCurrency,
                    forexAmount,
                });
                
                // API 응답의 krwAmount가 잘못된 경우, appliedRate로 계산
                // buy: 외화 금액 * 환율 = 필요한 KRW
                // sale: 외화 금액 * 환율 = 받을 KRW
                const calculatedKrwAmount = exchangeValue * quote.data.appliedRate;
                
                // API 응답 값이 계산 값과 크게 다르면 계산 값 사용
                const krwAmountToUse = Math.abs(quote.data.krwAmount - calculatedKrwAmount) > calculatedKrwAmount * 0.1 
                    ? calculatedKrwAmount 
                    : quote.data.krwAmount;
                
                setKrwAmount(krwAmountToUse);
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
                        {isLoading ? '조회 중...' : krwAmount !== null ? Math.round(krwAmount).toLocaleString('ko-KR') : '-'}
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
                        txt={isExchanging ? '환전 중...' : '환전하기'}
                        onClick={() => { void handleExchange(); }}
                        disabled={isExchanging || isLoading}
                    />
                </div>
            </div>
        </div>
    )
}