import { useEffect, useState } from "react"
import { HTTPError } from "ky"
import { ContantsContainer } from "../components/container/ContantsContainer"
import { ContantsHeader } from "../components/ContantsHeader"
import { InfoCard } from "../components/info/InfoCard"
import type { ExchangeRateItem } from "../api/exchangeRates"
import { fetchLatestExchangeRates } from "../api/exchangeRates"
import type { WalletItem } from "../api/wallets"
import { fetchWallets } from "../api/wallets"
import { InfoContainer } from "../components/container/InfoContainer"

export function InfoPage() {
  const [rates, setRates] = useState<ExchangeRateItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wallets, setWallets] = useState<WalletItem[] | null>(null);
  const [totalKrwBalance, setTotalKrwBalance] = useState<number | null>(null);

  useEffect(() => {
    // 최신 환율 데이터 조회
    async function loadRates() {
      try {
        const res = await fetchLatestExchangeRates();

        // USD가 앞으로 오도록 수정
        const sorted = [...res.data].sort((a, b) => {
          if (a.currency === "USD" && b.currency !== "USD") return -1;
          if (a.currency !== "USD" && b.currency === "USD") return 1;
          return 0;
        });
        setRates(sorted);
        setError(null);
      } catch (e) {
        console.error(e);

        if (e instanceof HTTPError) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const body = await e.response.json<any>();
            if (body?.code === "UNAUTHORIZED") {
              setRates(null);
              setError("로그인이 만료되었습니다. 다시 로그인 해주세요.");
              return;
            }
          } catch {
            // 일반 에러 처리
          }
        }

        setError("환율 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }

    // 지갑 데이터 조회
    async function loadWallets() {
      try {
        const res = await fetchWallets();
        setWallets(res.data.wallets);
        setTotalKrwBalance(res.data.totalKrwBalance);
      } catch (e) {
        console.error(e);
      }
    }

    // 최초 한 번 즉시 호출
    loadRates();
    loadWallets();

    // 1분 마다 재호출
    const intervalId = window.setInterval(() => {
      loadRates();
      loadWallets();
    }, 60_000);

    // 인터벌 정리
    return () => {
      window.clearInterval(intervalId);
    };
  }, [])

  return (
    <ContantsContainer>
      <ContantsHeader title="환율 정보" desc="실시간 환율을 확인하고 간편하게 환전하세요." />

      {loading && <p className="mt-4 text-[#646F7C]">환율 정보를 불러오는 중입니다...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      
      <div className="h-max flex flex-col justify-between gap-[24px] xl:flex-row">
        <div className="w-full h-auto">
          {/* 환율 정보 */}
          {!loading && !error && rates && (
            <div className="flex gap-[20px] mb-[24px]">
              {rates.map((rate) => (
                <InfoCard
                  key={rate.exchangeRateId}
                  title={rate.currency}
                  rate={rate.rate}
                  changePercentage={rate.changePercentage}
                />
              ))}
            </div>
          )}

          {/* 내 지갑 */}
          <InfoContainer height={176}>
            <div className="flex h-full flex-col gap-[24px] justify-between">
              <div className="flex flex-col gap-[24px]">
                <p className="text-[24px] text-[#28323C] font-extrabold">내 지갑</p>
                <div className="flex flex-col gap-[12px] text-[20px] text-[#646F7C]">
                  {wallets?.map((wallet) => {
                    // 포맷팅
                    let formattedBalance = "";
                    if (wallet.currency === "KRW") {
                      formattedBalance = `₩ ${wallet.balance.toLocaleString("ko-KR")}`;
                    } else if (wallet.currency === "USD") {
                      formattedBalance = `$ ${wallet.balance.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`;
                    } else if (wallet.currency === "JPY") {
                      formattedBalance = `¥ ${wallet.balance.toLocaleString("ja-JP")}`;
                    } else {
                      formattedBalance = wallet.balance.toLocaleString("ko-KR");
                    }

                    return (
                      <div key={wallet.walletId} className="flex items-center justify-between">
                        <p className="font-medium">{wallet.currency}</p>
                        <p className="font-semibold">{formattedBalance}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center justify-between pt-[20px] border-t border-[#C5C8CE]">
                <p className="text-[#646F7C] text-[20px] font-medium">총 보유 자산</p>
                <p className="text-[#3479EB] text-[20px] font-bold">
                  {totalKrwBalance !== null
                    ? `₩ ${totalKrwBalance.toLocaleString("ko-KR")}`
                    : "₩ 0"}
                </p>
              </div>
            </div>
          </InfoContainer>
        </div>
        <div className="w-full h-[700px]">
          <InfoContainer>
            환전 섹션
          </InfoContainer>
        </div>
      </div>
    </ContantsContainer>
  )
}