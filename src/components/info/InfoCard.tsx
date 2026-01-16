import { VscTriangleUp, VscTriangleDown } from "react-icons/vsc";

type InfoCardProps = {
  title: string,
  rate: number,
  changePercentage: number,
}

export function InfoCard({ title, rate, changePercentage }: InfoCardProps) {
  const isUp = changePercentage >= 0;
  const ChangeIcon = isUp ? VscTriangleUp : VscTriangleDown;
  const formattedRate = `${rate.toLocaleString("ko-KR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} KRW`;

  const desc = title === 'USD' ? '미국 달러' : '일본 엔화';

  return (
    <div className="w-full flex flex-col gap-[8px] border border-[#D0D6DB] rounded-[12px] py-[24px] px-[32px]">
      <div className="flex items-start justify-between text-[#646F7C]">
        <p className="text-[20px] font-semibold">{title}</p>
        <p className="text-[16px]">{desc}</p>
      </div>
      <div className="flex flex-col gap-[4px]">
        <p className="text-[#28323C] text-[24px] font-bold">{formattedRate}</p>
        <div className={`flex gap-[4px] text-[16px] ${isUp ? "text-[#FE5050]" : "text-[#3B6EFF]"}`}>
          <ChangeIcon size={20} />
          {isUp ? "+" : "-"}
          {Math.abs(changePercentage).toFixed(2)}%
        </div>
      </div>
    </div>
  )
}
