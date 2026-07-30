const PATHS = {
  Governance: (
    <>
      <path d="M12 2 L4 6 v2 h16 V6 Z" />
      <path d="M4 10 v9 M9 10 v9 M15 10 v9 M20 10 v9" />
      <path d="M2 21 h20" />
    </>
  ),
  Education: (
    <>
      <path d="M2 6 c4-2 8-2 10 0 c2-2 6-2 10 0 v12 c-4-2-8-2-10 0 c-2-2-6-2-10 0 Z" />
      <path d="M12 6 v12" />
    </>
  ),
  Health: (
    <>
      <path d="M12 21 C7 17 3 13.5 3 9.5 A4.5 4.5 0 0 1 12 7 A4.5 4.5 0 0 1 21 9.5 C21 13.5 17 17 12 21 Z" />
      <path d="M9 10 h3 l1 -2 l2 4 l1 -2 h2" />
    </>
  ),
  'Water & Infrastructure': (
    <>
      <path d="M12 3 C8 8 6 11.5 6 14.5 A6 6 0 0 0 18 14.5 C18 11.5 16 8 12 3 Z" />
      <path d="M2 20 h20" />
      <path d="M5 20 l3 -4 l3 3 l3 -5 l3 4 l2 -2" />
    </>
  ),
  Security: (
    <>
      <path d="M12 2 L20 5 v6 c0 5-3.5 8.5-8 9 c-4.5-0.5-8-4-8-9 V5 Z" />
      <path d="M9 12 l2 2 l4 -4" />
    </>
  ),
  Agriculture: (
    <>
      <path d="M12 21 V9" />
      <path d="M12 9 C12 5 9 3 5 3 C5 7 8 9 12 9 Z" />
      <path d="M12 13 C12 10 14.5 8 18 8 C18 11.5 15.5 13 12 13 Z" />
    </>
  ),
  Environment: (
    <>
      <path d="M12 2 L5 12 h4 l-3 6 h12 l-3 -6 h4 Z" />
      <path d="M12 20 v2" />
    </>
  ),
};

export function TopicIcon({ topic, size = 26 }) {
  const path = PATHS[topic];
  if (!path) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}
