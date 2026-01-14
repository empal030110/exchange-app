export function ContantsHeader({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="flex flex-col gap-[8px] mb-[40px]">
            <div className="font-bold text-[40px] text-[#28323C]">{title}</div>
            <div className="text-[20px] text-[#374553]">{desc}</div>
        </div>
    )
}