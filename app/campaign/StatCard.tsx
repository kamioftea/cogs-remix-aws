import { useState } from "react";

export interface StatCardProps {
  name: string;
  cardId: string;
  moveId: string;
}

export default function StatCard({ name, cardId, moveId }: StatCardProps) {
  const [isFlipped, setFlipped] = useState<boolean>(false);
  const imgSrc = isFlipped
    ? `https://moontome.b-cdn.net/StatCardsHd/${moveId}.webp`
    : `https://moontome.b-cdn.net/StatCardsHd/${cardId}.webp`;

  return (
    <div className="stat-card">
      <img
        src={imgSrc}
        alt={`${name} ${isFlipped ? "signature move" : "stat card"}`}
        onClick={() => setFlipped((flag) => !flag)}
      />
    </div>
  );
}
