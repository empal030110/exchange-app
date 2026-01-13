export function PageContainer({ children }: { children: React.ReactNode; }) {
  return (
    <div className="w-full h-full p-[20px]">
      {children}
    </div>
  );
}