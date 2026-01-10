import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useParams } from "react-router";
import Header from "src/modules/common/components/Header";
import {
  useGetCachedLobbyQuery,
  useGetLobbyQuery,
} from "src/modules/lobbies/api/lobbies";
import { useAppSelector } from "src/store";
import { Button } from "src/ui/components/Button";
import ConnectionIcon from "src/ui/components/ConnectionIcon";
import PageLayout from "src/ui/components/PageLayout";
import { ProgressBar } from "src/ui/components/ProgressBar";
import { WsEventType, WsMessage } from "../api/types";
import PlayingCard from "../components/cards/PlayingCard";
import { Card } from "../components/cards/types";
import GameTable from "../components/GameTable";
import { useStomp } from "../hooks/useStomp";
import { parsePlainCard } from "../utils/game";

const cardsEqual = (a: Card[], b: Card[]) =>
  a.length === b.length &&
  a.every((c, i) => c.value === b[i].value && c.suit === b[i].suit);

const GamePage = () => {
  const { id } = useParams<{ id?: string }>();
  const lobbyId = id ? Number(id) : NaN;

  const user = useAppSelector((s) => s.auth.user);
  const isAuth = useAppSelector((s) => s.auth.isAuthenticated);
  const jwt = useAppSelector((s) => s.auth.accessToken!);

  const { data: lobby, isLoading: isLoadingLobby } = useGetLobbyQuery(lobbyId, {
    skip: !isAuth || Number.isNaN(lobbyId),
  });

  const [userCards, setUserCards] = useState<Card[] | null>(null);
  const [chosenCardIdx, setChosenCardIdx] = useState<number | null>(null);
  const [roundNumber, setRoundNumber] = useState(0);

  /* -------------------- refs used by socket -------------------- */

  const chooseCardRef = useRef<(idx: number) => void>(() => {});
  const chosenCardIdxRef = useRef<number | null>(null);

  useEffect(() => {
    chosenCardIdxRef.current = chosenCardIdx;
  }, [chosenCardIdx]);

  /* -------------------- cached lobby (with polling) -------------------- */

  const {
    data: cachedLobby,
    isLoading: isLoadingCachedLobby,
    // refetch: refetchCachedLobby,
  } = useGetCachedLobbyQuery(lobbyId, {
    skip: !isAuth || Number.isNaN(lobbyId),
    // pollingInterval: !user || Number.isNaN(lobbyId) ? 0 : 7000, // safety sync
  });

  /* -------------------- game state ---------------------- */

  const [lastSwapTimestamp, setLastSwapTimestamp] = useState<number>(
    Date.now(),
  );

  /* -------------------- derived state -------------------- */

  const folded = useMemo(() => {
    if (!cachedLobby || !user) return false;
    const currentPlayer = cachedLobby.players.find(
      (p) => p.userId === user.userId,
    );
    return currentPlayer?.foldOrderNumber != null;
  }, [cachedLobby, user]);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!lobby) return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - lastSwapTimestamp) / 1000;
      const pct = Math.min((elapsed / lobby.moveTimeout) * 100, 100);
      setProgress(100 - pct);
    }, 50);

    return () => clearInterval(interval);
  }, [lastSwapTimestamp, lobby]);

  /* -------------------- socket handler (stable) -------------------- */

  const onSocketMsg = useCallback((msg: WsMessage) => {
    switch (msg.eventType) {
      case WsEventType.PLAYER_RECIEVED_CARD: {
        console.log("Player received card", msg.payload);

        setRoundNumber((rn) => rn + 1);
        setLastSwapTimestamp(Date.now());
        setUserCards((prev) => {
          if (!prev) return prev;
          const newCard = parsePlainCard(msg.payload.card.value);
          return [
            ...prev.slice(0, msg.payload.idx),
            newCard,
            ...prev.slice(msg.payload.idx + 1),
          ];
        });

        const idx = chosenCardIdxRef.current ?? msg.payload.idx;

        chooseCardRef.current(idx);
        break;
      }

      case WsEventType.PLAYER_CHOSE_CARD:
        console.log("Player chose card", msg.payload);
        break;

      case WsEventType.GAME_STARTED:
        console.log(msg.payload.message);
        break;

      default:
        break;
    }
  }, []);

  /* -------------------- stomp -------------------- */

  const { connected, send } = useStomp({
    url: "/user/queue/private",
    jwt,
    onMessage: onSocketMsg,
    skip: !isAuth || Number.isNaN(lobbyId),
  });

  /* -------------------- actions -------------------- */

  const chooseCard = useCallback(
    (idx: number) => {
      if (!connected || !userCards) return;

      setChosenCardIdx(idx);
      send("/app/lobby/selectCard", { chosenCardIndex: idx });
    },
    [connected, userCards, send],
  );

  useEffect(() => {
    chooseCardRef.current = chooseCard;
  }, [chooseCard]);

  const foldCards = useCallback(() => {
    send("/app/lobby/fold", {});
  }, [send]);

  /* -------------------- sync hand from cached lobby (poll-safe) -------------------- */

  useEffect(() => {
    if (!cachedLobby || !user) return;

    const currentPlayer = cachedLobby.players.find(
      (p) => p.userId === user.userId,
    );

    if (!currentPlayer?.hand) return;

    console.log("Syncing hand from cached lobby:", currentPlayer.hand);

    const nextCards = currentPlayer.hand
      .filter(Boolean)
      .map((c) => parsePlainCard(c!.value));

    setUserCards((prev) => {
      if (!prev) return nextCards;
      return cardsEqual(prev, nextCards) ? prev : nextCards;
    });

    setRoundNumber((rn) => rn + 1);
  }, [cachedLobby, user]);

  /* -------------------- render -------------------- */

  if (isLoadingLobby || isLoadingCachedLobby) return <div>Loading...</div>;

  if (!lobby || !cachedLobby) return <Navigate to="/" />;

  return (
    <PageLayout>
      <PageLayout.Header>
        <Header
          title={lobby.name}
          size="sm"
          showBackButton={false}
          rightSlot={<ConnectionIcon connected={connected} />}
        />
      </PageLayout.Header>

      <PageLayout.Body className="flex flex-col items-center justify-center gap-5">
        <GameTable
          players={cachedLobby.players.filter((p) => p.userId !== user?.userId)}
          iconRotation={roundNumber * (360 / cachedLobby.players.length)}
        />

        <div className="px-4 w-full">
          <ProgressBar
            className="my-2"
            progress={progress}
            animated
            label={`${Math.ceil((((100 - progress) / 100) * lobby.moveTimeout) / 1000)}s left`}
          />
        </div>

        <div className="flex gap-3">
          {folded ? (
            <h2>You have finished, congrats</h2>
          ) : userCards ? (
            userCards.map((card, i) => (
              <PlayingCard
                key={i}
                card={card}
                selected={i === chosenCardIdx}
                onClick={() => chooseCard(i)}
              />
            ))
          ) : (
            <div>Loading cards...</div>
          )}
        </div>
      </PageLayout.Body>

      <PageLayout.Footer>
        <div className="p-4">
          <Button
            className="w-full py-4"
            onClick={() => foldCards()}
            disabled={folded}
          >
            GOVNO
          </Button>
        </div>
      </PageLayout.Footer>
    </PageLayout>
  );
};

export default GamePage;
