import { useEffect } from "react";

export default function Toast({ mensaje, visible, onCerrar }) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onCerrar, 3500);
    return () => clearTimeout(t);
  }, [visible, onCerrar]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-sm bg-ink px-5 py-4 text-board shadow-lg"
    >
      <span className="h-2 w-2 shrink-0 rounded-full bg-band-green" />
      <p className="text-sm">{mensaje}</p>
    </div>
  );
}