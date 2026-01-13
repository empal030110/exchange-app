export function Button({ txt }: { txt: string }) {
    return (
        <div className="w-full bg-[#1B2334] py-[24px] px-[10px] rounded-[12px] font-bold text-[22px] text-white flex items-center justify-center">
            {txt}
        </div>
    )
}