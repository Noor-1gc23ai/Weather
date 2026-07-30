import { AlertTriangle } from "lucide-react";

export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div
      className="sunrise-glow glass-panel mt-8 rounded-[1.6rem] border border-[#f57c00]/25 bg-[#fff1cf]/90 p-4 text-[#6B3E00] shadow-[0_18px_40px_rgba(134,73,0,0.12)]"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F57C00]/12 text-[#F57C00]">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#8B5A00]">Weather update unavailable</p>
          <p className="mt-1 text-base font-semibold">{message}</p>
        </div>
      </div>
    </div>
  );
}
