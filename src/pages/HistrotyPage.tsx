import { useEffect, useState } from "react";
import { HTTPError } from "ky";
import { ContantsContainer } from "../components/container/ContantsContainer";
import { ContantsHeader } from "../components/ContantsHeader";
import { fetchExchangeOrders, type ExchangeOrderItem } from "../api/exchangeRates";

export function HistoryPage() {
    const [orders, setOrders] = useState<ExchangeOrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadOrders() {
            try {
                const res = await fetchExchangeOrders();
                setOrders(res.data);
                setError(null);
            } catch (e) {
                console.error(e);

                if (e instanceof HTTPError) {
                    try {
                        const body = await e.response.json<{ code: string; message: string }>();
                        if (body?.code === "UNAUTHORIZED") {
                            setError("로그인이 만료되었습니다. 다시 로그인 해주세요.");
                            return;
                        }
                    } catch {
                        // 일반 에러 처리
                    }
                }

                setError("환전 내역을 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        }

        loadOrders();
    }, []);

    // 날짜 포맷팅 함수
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    // 금액 포맷팅 함수
    const formatAmount = (amount: number, currency: string) => {
        if (currency === "KRW") {
            return amount.toLocaleString('ko-KR');
        } else if (currency === "USD") {
            return amount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        } else if (currency === "JPY") {
            return amount.toLocaleString('ja-JP');
        }
        return amount.toLocaleString('ko-KR');
    };

    return (
        <ContantsContainer>
            <ContantsHeader title="환전 내역" desc="환전 내역을 확인하실 수 있어요." />
            <div className="w-full mt-[40px] border border-[#D0D6DB] rounded-[16px] py-[12px]">
                <div className="w-full whitespace-nowrap overflow-x-auto scrollbar-hide">
                    <div className="flex gap-[24px] border-y border-[#D0D6DB] py-[14px] px-[40px] text-[#646F7C] text-[18px] overflow-x-auto scrollbar-hide">
                        <p className="flex-1">거래 ID</p>
                        <p className="flex-1">거래 일시</p>
                        <p className="flex-1 text-end">매수 금액</p>
                        <p className="flex-1 text-end">체결 환율</p>
                        <p className="flex-1 text-end">매도 금액</p>
                    </div>
                    <div className="h-max max-h-[540px] overflow-y-auto text-[#374553] text-[18px] scrollbar-hide">
                        {loading && (
                            <div className="w-full pt-[30px] px-[40px] text-center text-[#646F7C]">
                                환전 내역을 불러오는 중입니다...
                            </div>
                        )}
                        {error && (
                            <div className="w-full pt-[30px] px-[40px] text-center text-red-500">
                                {error}
                            </div>
                        )}
                        {!loading && !error && orders.length === 0 && (
                            <div className="w-full pt-[30px] px-[40px] text-center text-[#646F7C]">
                                환전 내역이 없습니다.
                            </div>
                        )}
                        {!loading && !error && orders.map((order) => (
                            <div key={order.orderId} className="w-full pt-[30px] px-[40px] flex gap-[24px]">
                                <p className="flex-1">{order.orderId}</p>
                                <p className="flex-1">{formatDateTime(order.orderedAt)}</p>
                                <p className="flex-1 text-end">
                                    {formatAmount(order.fromAmount, order.fromCurrency)} {order.fromCurrency}
                                </p>
                                <p className="flex-1 text-end">{order.appliedRate.toLocaleString('ko-KR')}</p>
                                <p className="flex-1 text-end">
                                    {formatAmount(order.toAmount, order.toCurrency)} {order.toCurrency}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ContantsContainer>
    )
}