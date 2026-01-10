import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useNavigate, useParams } from "react-router";
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
  const navigate = useNavigate();

  const { id } = useParams<{ id?: string }>();
  const lobbyId = id ? Number(id) : NaN;

  const user = useAppSelector((s) => s.auth.user);
  const isAuth = useAppSelector((s) => s.auth.isAuthenticated);
  const jwt = useAppSelector((s) => s.auth.accessToken!);

  /* -------------------- Lobby queries -------------------- */
  const { data: lobby, isLoading: isLoadingLobby } = useGetLobbyQuery(lobbyId, {
    skip: !isAuth || Number.isNaN(lobbyId),
  });

  const {
    data: cachedLobby,
    isLoading: isLoadingCachedLobby,
    refetch: refetchCachedLobby,
  } = useGetCachedLobbyQuery(lobbyId, {
    skip: !isAuth || Number.isNaN(lobbyId),
  });

  /* -------------------- Game state -------------------- */
  const [userCards, setUserCards] = useState<Card[] | null>(null);
  const [chosenCardIdx, setChosenCardIdx] = useState<number | null>(null);
  const [roundNumber, setRoundNumber] = useState(0);
  const [lastSwapTimestamp, setLastSwapTimestamp] = useState(Date.now());
  const [progress, setProgress] = useState(0);

  const chooseCardRef = useRef<(idx: number) => void>(() => {});
  const chosenCardIdxRef = useRef<number | null>(null);

  useEffect(() => {
    chosenCardIdxRef.current = chosenCardIdx;
  }, [chosenCardIdx]);

  /* -------------------- Derived state -------------------- */
  const [folded, setFolded] = useState<boolean>(false);

  const displayPlayers = useMemo(() => {
    if (!cachedLobby || !user) return [];

    const idx = cachedLobby.players.findIndex((p) => p.userId === user.userId);
    if (idx === -1) return cachedLobby.players;

    return [
      ...cachedLobby.players.slice(idx + 1),
      ...cachedLobby.players.slice(0, idx + 1),
    ];
  }, [cachedLobby, user]);

  /* -------------------- Countdown Progress -------------------- */
  useEffect(() => {
    if (!lobby) return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - lastSwapTimestamp) / 1000;
      const pct = Math.min((elapsed / lobby.moveTimeout) * 100, 100);
      setProgress(100 - pct);
    }, 50);

    return () => clearInterval(interval);
  }, [lastSwapTimestamp, lobby]);

  /* -------------------- WebSocket -------------------- */
  const onSocketMsg = useCallback(
    (msg: WsMessage) => {
      console.log("game ws msg", msg);
      switch (msg.eventType) {
        case WsEventType.PLAYER_RECIEVED_CARD: {
          console.log("Player received card", msg.payload);
          setRoundNumber((rn) => rn + 1);
          setLastSwapTimestamp(Date.now());

          setUserCards((prev) => {
            if (!prev) return null;
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

        case WsEventType.GAME_FINISHED:
          console.log("Game finished, leaderboard:", msg.payload);
          toast(`Game finished! Congrats, ${msg.payload[0].displayName}!`, {
            icon: "🏆",
          });
          navigate("/leaderboard", { state: msg.payload });
          break;

        case WsEventType.ERROR_PLAYER_ILLEGAL_FOLD_ATTEMPT:
          console.log("Illegal fold attempt");
          toast(msg.payload, { icon: "🚫" });
          break;

        case WsEventType.PLAYER_FOLDED_CARDS:
          console.log("Player folded cards", msg.payload);
          toast(msg.payload, { icon: "🎉" });
          setFolded(true);
          break;

        default:
          break;
      }
    },
    [navigate],
  );

  const { connected, send } = useStomp({
    url: "/user/queue/private",
    jwt,
    onMessage: onSocketMsg,
    skip: !isAuth || Number.isNaN(lobbyId),
  });

  /* -------------------- Actions -------------------- */
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

  /* -------------------- Resync user hand -------------------- */
  const syncGameState = useCallback(async () => {
    if (!user || !refetchCachedLobby) return;

    const res = await refetchCachedLobby();
    const freshLobby = res.data;

    if (!freshLobby) return;

    console.log("syncing game state...");

    // sync folded state
    const currentPlayer = freshLobby.players.find(
      (p) => p.userId === user.userId,
    );

    if (currentPlayer?.foldOrderNumber != null) {
      setFolded(true);
      return;
    }

    // sync user hand
    if (!currentPlayer?.hand) return;
    const nextCards = currentPlayer.hand
      .filter(Boolean)
      .map((c) => parsePlainCard(c!.value));
    setUserCards((prev) =>
      prev ? (cardsEqual(prev, nextCards) ? prev : nextCards) : nextCards,
    );
  }, [user, refetchCachedLobby]);

  useEffect(() => {
    syncGameState();
  }, [syncGameState]);

  useEffect(() => {
    const interval = setInterval(() => {
      syncGameState();
    }, 5000);
    return () => clearInterval(interval);
  }, [syncGameState]);

  /* -------------------- Render -------------------- */
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
          players={displayPlayers.filter((p) => p.userId !== user?.userId)}
          iconRotation={roundNumber * (360 / cachedLobby.players.length)}
        />

        <div className="px-4 w-full">
          <ProgressBar
            className="my-2"
            progress={progress}
            animated
            label={`${((progress / 100) * lobby.moveTimeout).toFixed(1)}s left`}
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
          <Button className="w-full py-4" onClick={foldCards} disabled={folded}>
            GOVNO
          </Button>
        </div>
      </PageLayout.Footer>
    </PageLayout>
  );
};

export default GamePage;
