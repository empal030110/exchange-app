export function InfoContainer({ children, height }: { children: React.ReactNode, height?: number; }) {
  return (
    <div className={`w-full ${height ? `h-[calc(100%-${height}px)]` : 'h-full'} py-[24px] px-[32px] bg-[#F7F8F9] border border-[#D0D6DB] rounded-[12px]`}>
      {children}
    </div>
  );
}