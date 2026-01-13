type ButtonProps = {
    txt: string;
    onClick?: () => void;
    disabled?: boolean;
};

export function Button({ txt, onClick, disabled }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`w-full py-[24px] px-[10px] rounded-[12px] font-bold text-[22px] flex items-center justify-center ${disabled ? "bg-[#A0A7B4] text-white cursor-not-allowed" : "bg-[#1B2334] text-white cursor-pointer"}`}
    >
      {txt}
    </button>
  )
}