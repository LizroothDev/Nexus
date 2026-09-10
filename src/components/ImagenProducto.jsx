const colores = {
  Embebidos: "var(--color-band-violet)",
  Sensores: "var(--color-band-red)",
  Pasivos: "var(--color-band-gold)",
  Redes: "var(--color-band-green)",
};

export default function ImagenProducto({ categoria, className = "" }) {
  const color = colores[categoria] || "var(--color-trace)";

  return (
    <div className={`bg-ink ${className}`}>
      <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden="true">
        {/* Placa */}
        <rect x="20" y="20" width="160" height="100" rx="4" fill={color} opacity="0.9" />
        <rect x="20" y="20" width="160" height="100" rx="4" fill="#10141C" opacity="0.25" />

        {/* Chip central */}
        <rect x="78" y="55" width="44" height="30" rx="2" fill="#10141C" />

        {/* Headers */}
        <rect x="34" y="26" width="132" height="7" rx="1" fill="#10141C" />
        <rect x="34" y="107" width="132" height="7" rx="1" fill="#10141C" />

        {/* Componentes sueltos */}
        <circle cx="45" cy="70" r="9" fill="#10141C" />
        <circle cx="158" cy="70" r="7" fill="#10141C" />
        <rect x="35" y="90" width="22" height="7" rx="3.5" fill="#F2F4F1" />
        <rect x="146" y="90" width="22" height="7" rx="3.5" fill="#F2F4F1" />
      </svg>
    </div>
  );
}