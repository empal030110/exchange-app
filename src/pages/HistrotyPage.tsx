import { ContantsContainer } from "../components/container/ContantsContainer";
import { ContantsHeader } from "../components/ContantsHeader";

export function HistoryPage() {
    return (
        <ContantsContainer>
            <ContantsHeader title="환전 내역" desc="환전 내역을 확인하실 수 있어요." />
            <div className="w-full mt-[40px] border border-[#D0D6DB] rounded-[16px] py-[12px]">
                <div className="w-full">
                    <div className="flex border-y border-[#D0D6DB] py-[14px] px-[40px] text-[#646F7C] text-[18px]">
                        <p className="flex-1">거래 ID</p>
                        <p className="flex-1">거래 일시</p>
                        <p className="flex-1 text-end">매수 금액</p>
                        <p className="flex-1 text-end">체결 환율</p>
                        <p className="flex-1 text-end">매도 금액</p>
                    </div>
                    <div className="h-max max-h-[540px] overflow-y-auto text-[#374553] text-[18px]">
                        <div className="w-full pt-[30px] px-[40px] flex">
                            <p className="flex-1">11</p>
                            <p className="flex-1">2025-10-05 00:00:00</p>
                            <p className="flex-1 text-end">32.50</p>
                            <p className="flex-1 text-end">1,383.07</p>
                            <p className="flex-1 text-end">51,976</p>
                        </div>
                        <div className="w-full pt-[30px] px-[40px] flex">
                            <p className="flex-1">10</p>
                            <p className="flex-1">2025-10-05 00:00:00</p>
                            <p className="flex-1 text-end">32.50</p>
                            <p className="flex-1 text-end">1,383.07</p>
                            <p className="flex-1 text-end">51,976</p>
                        </div>
                        <div className="w-full pt-[30px] px-[40px] flex">
                            <p className="flex-1">9</p>
                            <p className="flex-1">2025-10-05 00:00:00</p>
                            <p className="flex-1 text-end">32.50</p>
                            <p className="flex-1 text-end">1,383.07</p>
                            <p className="flex-1 text-end">51,976</p>
                        </div>
                        <div className="w-full pt-[30px] px-[40px] flex">
                            <p className="flex-1">8</p>
                            <p className="flex-1">2025-10-05 00:00:00</p>
                            <p className="flex-1 text-end">32.50</p>
                            <p className="flex-1 text-end">1,383.07</p>
                            <p className="flex-1 text-end">51,976</p>
                        </div>
                        <div className="w-full pt-[30px] px-[40px] flex">
                            <p className="flex-1">7</p>
                            <p className="flex-1">2025-10-05 00:00:00</p>
                            <p className="flex-1 text-end">32.50</p>
                            <p className="flex-1 text-end">1,383.07</p>
                            <p className="flex-1 text-end">51,976</p>
                        </div>
                        <div className="w-full pt-[30px] px-[40px] flex">
                            <p className="flex-1">6</p>
                            <p className="flex-1">2025-10-05 00:00:00</p>
                            <p className="flex-1 text-end">32.50</p>
                            <p className="flex-1 text-end">1,383.07</p>
                            <p className="flex-1 text-end">51,976</p>
                        </div>
                        <div className="w-full pt-[30px] px-[40px] flex">
                            <p className="flex-1">5</p>
                            <p className="flex-1">2025-10-05 00:00:00</p>
                            <p className="flex-1 text-end">32.50</p>
                            <p className="flex-1 text-end">1,383.07</p>
                            <p className="flex-1 text-end">51,976</p>
                        </div>
                        <div className="w-full pt-[30px] px-[40px] flex">
                            <p className="flex-1">4</p>
                            <p className="flex-1">2025-10-05 00:00:00</p>
                            <p className="flex-1 text-end">32.50</p>
                            <p className="flex-1 text-end">1,383.07</p>
                            <p className="flex-1 text-end">51,976</p>
                        </div>
                        <div className="w-full pt-[30px] px-[40px] flex">
                            <p className="flex-1">3</p>
                            <p className="flex-1">2025-10-05 00:00:00</p>
                            <p className="flex-1 text-end">32.50</p>
                            <p className="flex-1 text-end">1,383.07</p>
                            <p className="flex-1 text-end">51,976</p>
                        </div>
                        <div className="w-full pt-[30px] px-[40px] flex">
                            <p className="flex-1">2</p>
                            <p className="flex-1">2025-10-05 00:00:00</p>
                            <p className="flex-1 text-end">32.50</p>
                            <p className="flex-1 text-end">1,383.07</p>
                            <p className="flex-1 text-end">51,976</p>
                        </div>
                        <div className="w-full pt-[30px] px-[40px] flex">
                            <p className="flex-1">1</p>
                            <p className="flex-1">2025-10-05 00:00:00</p>
                            <p className="flex-1 text-end">32.50</p>
                            <p className="flex-1 text-end">1,383.07</p>
                            <p className="flex-1 text-end">51,976</p>
                        </div>
                    </div>
                </div>
            </div>
        </ContantsContainer>
    )
}