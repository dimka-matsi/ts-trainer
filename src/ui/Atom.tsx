/** Значок React: ядро и три орбиты. Цвет берёт из currentColor. */
export function Atom({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg className={className} viewBox="-12 -12 24 24" width={size} height={size} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle r="2.1" fill="currentColor" stroke="none" />
      <ellipse rx="10.5" ry="4.2" />
      <ellipse rx="10.5" ry="4.2" transform="rotate(60)" />
      <ellipse rx="10.5" ry="4.2" transform="rotate(120)" />
    </svg>
  );
}
