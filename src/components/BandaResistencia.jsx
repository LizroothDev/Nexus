export default function BandaResistencia({ className = "" }) {
  return (
    <div className={`flex h-1 w-full ${className}`}>
      <span className="flex-1 bg-band-red" />
      <span className="flex-1 bg-band-violet" />
      <span className="flex-1 bg-band-gold" />
      <span className="flex-1 bg-band-green" />
    </div>
  );
}