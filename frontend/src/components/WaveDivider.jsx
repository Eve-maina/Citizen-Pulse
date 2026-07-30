export function WaveDivider() {
  return (
    <div className="wave-divider" aria-hidden="true">
      <svg viewBox="0 0 1200 60" preserveAspectRatio="none">
        <path
          className="wave wave-back"
          d="M0,30 C150,60 350,0 600,25 C850,50 1050,10 1200,30 L1200,60 L0,60 Z"
        />
        <path
          className="wave wave-front"
          d="M0,35 C200,10 400,55 600,30 C800,5 1000,45 1200,20 L1200,60 L0,60 Z"
        />
      </svg>
    </div>
  );
}
