export function InfoContainer({ children, height }: { children: React.ReactNode, height?: number }) {
  const style = height ? ({ height: `calc(100% - ${height}px)` } as const) : undefined;

  return (
    <div className={`w-full ${height ? "" : "h-full"} py-[24px] px-[32px] bg-[#F7F8F9] border border-[#D0D6DB] rounded-[12px]`} style={style}>
      {children}
    </div>
  );
}