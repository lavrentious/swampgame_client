import clsx from "clsx";
import React, { useMemo, useState } from "react";
import Header from "src/modules/common/components/Header";
import { Button } from "src/ui/components/Button";
import PageLayout from "src/ui/components/PageLayout";
import PlayingCard from "../components/cards/PlayingCard";
import {
  CardSuit,
  Card as CardType,
  CardValue,
} from "../components/cards/types";

/* ---------------- mock data ---------------- */

type Player = {
  id: string;
  name: string;
};

const PLAYERS: Player[] = [
  {
    id: "1",
    name: "Andrey Andrey Andrey Andrey Andrey Andrey Andrey Andrey Andrey Andrey Andrey Andrey Andrey Andrey",
  },
  { id: "2", name: "Igor" },
  { id: "3", name: "Maria" },
  { id: "4", name: "Joe Biden" },
  { id: "5", name: "Alex" },
  { id: "6", name: "Alex" },
  { id: "7", name: "Alex" },
  { id: "8", name: "Alex" },
  { id: "9", name: "Alex" },
  { id: "10", name: "Alex" },
  { id: "11", name: "Alex" },
  { id: "12", name: "Alex" },
];

/* ---------------- layout helpers ---------------- */

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

/* ---------------- components ---------------- */

const userCards: CardType[] = [
  {
    value: CardValue.ACE,
    suit: CardSuit.CLUBS,
  },
  {
    value: CardValue.TEN,
    suit: CardSuit.DIAMONDS,
  },
  {
    value: CardValue.SIX,
    suit: CardSuit.SPADES,
  },
  {
    value: CardValue.NINE,
    suit: CardSuit.HEARTS,
  },
];

const PlayerSeat: React.FC<{ player: Player; active?: boolean }> = ({
  player,
  active,
}) => {
  return (
    <div className="flex flex-col items-center">
      <FannedCards count={4} />
      <span
        className={clsx(
          "text-sm text-white/80 whitespace-nowrap overflow-hidden text-ellipsis max-w-30",
          active && "text-white",
        )}
      >
        {player.name}
      </span>
    </div>
  );
};

type FannedCardsProps = {
  count: number;
} & React.HTMLAttributes<HTMLDivElement>;
const FannedCards: React.FC<FannedCardsProps> = ({
  count,
  className,
  ...props
}) => {
  const maxSpreadDeg = 30;
  const spread = maxSpreadDeg;
  const start = -spread / 2;

  return (
    <div className={clsx("relative h-16 w-28", className)} {...props}>
      {Array.from({ length: count }).map((_, i) => {
        const t = count === 1 ? 0.5 : i / (count - 1);
        const angle = start + t * spread;
        const offset = (t - 0.5) * 18;

        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 w-8 h-12 rounded bg-primary shadow border-2"
            style={{
              transform: `
                translate(-50%, -50%)
                translateX(${offset}px)
                rotate(${angle}deg)
              `,
              transformOrigin: "center",
            }}
          />
        );
      })}
    </div>
  );
};

const Table: React.FC<
  { players: Player[] } & React.HTMLAttributes<HTMLDivElement>
> = ({ players, className, ...props }) => {
  const radius = Math.min(42, 50 - players.length * 0.5);
  const center = 50;
  const totalSpots = players.length + 1;

  const gapAngle = 180;

  return (
    <div
      className={clsx(
        "relative mx-auto w-[80vw] max-w-md aspect-square",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 rounded-full bg-white/5" />

      {players.map((player, index) => {
        const slotIndex = (index + 1) % totalSpots;
        const angle = (360 / totalSpots) * slotIndex;
        const rotatedAngle = (angle + gapAngle) % 360;

        const { x, y } = polarToCartesian(center, center, radius, rotatedAngle);

        const scale = Math.max(0.7, Math.min(1.3, 9 / players.length));

        return (
          <div
            key={player.id}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: `translate(-50%, -50%) scale(${scale})`,
            }}
          >
            <PlayerSeat player={player} />
          </div>
        );
      })}
    </div>
  );
};

/* ---------------- page ---------------- */

const GamePage = () => {
  const [playerCount, setPlayerCount] = useState(3);
  const players = useMemo(() => PLAYERS.slice(0, playerCount), [playerCount]);

  // const activePlayersIds = [3, 4];

  return (
    <PageLayout>
      <PageLayout.Header className="relative z-0">
        <Header title="Kopytov Party" size="sm" showBackButton={false} />

        <Button
          size="sm"
          onClick={() => setPlayerCount((p) => Math.min(12, p + 1))}
        >
          +
        </Button>
        <Button
          size="sm"
          onClick={() => setPlayerCount((p) => Math.max(3, p - 1))}
        >
          -
        </Button>
      </PageLayout.Header>

      <PageLayout.Body className="flex flex-col items-center justify-center gap-5 overflow-x-hidden relative z-100">
        <Table players={players.slice(0, Math.min(players.length, 13))} />

        <div className="text-white/80">
          time left: <strong className="text-white">12 sec</strong>
        </div>

        <div className="flex gap-3 max-w-full">
          {userCards.map((card, i) => (
            <PlayingCard key={i} card={card} className="shadow-lg" />
          ))}
        </div>
      </PageLayout.Body>

      <PageLayout.Footer>
        <div className="p-4">
          <Button className="w-full py-4">SWAMP</Button>
        </div>
      </PageLayout.Footer>
    </PageLayout>
  );
};

export default GamePage;
