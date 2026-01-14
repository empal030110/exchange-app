import { useEffect, useState } from "react"
import { ContantsContainer } from "../components/container/ContantsContainer"
import { ContantsHeader } from "../components/ContantsHeader"
import { InfoCard } from "../components/info/InfoCard"
import type { ExchangeRateItem } from "../api/exchangeRates"
import { fetchLatestExchangeRates } from "../api/exchangeRates"

export function InfoPage() {
  const [rates, setRates] = useState<ExchangeRateItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 최신 환율 데이터 조회
    async function load() {
      try {
        const res = await fetchLatestExchangeRates();

        // 로그인 만료 처리
        if (res.code === "UNAUTHORIZED") {
          setRates(null);
          setError("로그인이 만료되었습니다. 다시 로그인 해주세요.");
          return;
        }

        if (res.code !== "OK") {
          setRates(null);
          setError("환율 정보를 불러오지 못했습니다.");
          return;
        }

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
        setError("환율 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }

    // 최초 한 번 즉시 호출
    load();

    // 1분 마다 재호출
    const intervalId = window.setInterval(load, 60_000);

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

      {!loading && !error && rates && (
        <div className="flex gap-[20px]">
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
    </ContantsContainer>
  )
}