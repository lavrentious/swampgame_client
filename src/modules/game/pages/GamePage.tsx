import { useMemo, useState } from "react";
import Header from "src/modules/common/components/Header";
import { Player } from "src/modules/lobbies/api/types";
import { Button } from "src/ui/components/Button";
import PageLayout from "src/ui/components/PageLayout";
import PlayingCard from "../components/cards/PlayingCard";
import {
  CardSuit,
  Card as CardType,
  CardValue,
} from "../components/cards/types";
import GameTable from "../components/GameTable";

/* ---------------- mock data ---------------- */

const PLAYERS: Player[] = [
  {
    id: 1,
    firstName:
      "Andrey Andrey Andrey Andrey Andrey Andrey Andrey Andrey Andrey Andrey Andrey Andrey Andrey Andrey",
  },
  { id: 2, firstName: "Igor" },
  { id: 3, firstName: "Maria" },
  { id: 4, firstName: "Joe Biden" },
  { id: 5, firstName: "Alex" },
  { id: 6, firstName: "Alex" },
  { id: 7, firstName: "Alex" },
  { id: 8, firstName: "Alex" },
  { id: 9, firstName: "Alex" },
  { id: 10, firstName: "Alex" },
  { id: 11, firstName: "Alex" },
  { id: 12, firstName: "Alex" },
];

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
        <GameTable players={players.slice(0, Math.min(players.length, 13))} />

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
