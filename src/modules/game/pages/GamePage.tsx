import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useNavigate, useParams } from "react-router";
import { formatApiError } from "src/modules/common/api/utils";
import Header from "src/modules/common/components/Header";
import {
  lobbiesApi,
  useGetCachedLobbyQuery,
  useGetLobbyQuery,
} from "src/modules/lobbies/api/lobbies";
import { useAppDispatch, useAppSelector } from "src/store";
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
  const dispatch = useAppDispatch();

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
    isError: isErrorCachedLobby,
    error: errorCachedLobby,
  } = useGetCachedLobbyQuery(lobbyId, {
    skip: !isAuth || Number.isNaN(lobbyId),
  });

  /* -------------------- Game state -------------------- */
  const [userCards, setUserCards] = useState<Card[] | null>(null);
  const [chosenCardIdx, setChosenCardIdx] = useState<number | null>(null);
  const [roundNumber, setRoundNumber] = useState(0);
  const [lastSwapTimestamp, setLastSwapTimestamp] = useState(Date.now());
  const [progress, setProgress] = useState(0);
  const [firstFoldedUserId, setFirstFoldedUserId] = useState<number | null>(
    null,
  );
  const [foldError, setFoldError] = useState(false);
  const [foldCooldown, setFoldCooldown] = useState(false);

  const foldOrderNumber = useMemo(() => {
    if (!cachedLobby) return null;
    return cachedLobby.players.find((p) => p.userId === user?.userId)
      ?.foldOrderNumber;
  }, [cachedLobby, user?.userId]);

  const chooseCardRef = useRef<(idx: number) => void>(() => {});
  const chosenCardIdxRef = useRef<number | null>(null);

  useEffect(() => {
    chosenCardIdxRef.current = chosenCardIdx;
  }, [chosenCardIdx]);

  /* -------------------- Derived state -------------------- */
  const [folded, setFolded] = useState<boolean>(false);

  const highlightCards = useMemo(() => {
    if (!userCards) return false;
    return userCards.every((c) => c.value === userCards[0].value);
  }, [userCards]);
  const highlightFold = useMemo(() => {
    if (highlightCards) return true;
    if (firstFoldedUserId != null && !folded) return true;
  }, [firstFoldedUserId, folded, highlightCards]);
  const disableCards = useMemo(() => {
    if (highlightCards) return false;
    if (firstFoldedUserId != null && firstFoldedUserId != user?.userId)
      return true;
  }, [firstFoldedUserId, highlightCards, user?.userId]);

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
          navigate(`/leaderboard/${lobbyId}`, { state: msg.payload });
          break;

        case WsEventType.ERROR_PLAYER_ILLEGAL_FOLD_ATTEMPT:
          console.log("Illegal fold attempt");
          toast(msg.payload, { icon: "🚫" });

          setFoldError(true);
          setFoldCooldown(true);

          setTimeout(() => setFoldError(false), 500);
          setTimeout(() => setFoldCooldown(false), 1500);

          break;

        case WsEventType.PLAYER_FOLDED_CARDS:
          console.log("Player folded cards", msg.payload);
          if (msg.userId === user?.userId) {
            toast("You have folded your cards!", { icon: "🃏" });
            setFolded(true);
          }

          dispatch(
            lobbiesApi.util.updateQueryData(
              "getCachedLobby",
              lobbyId,
              (draft) => {
                const player = draft.players.find(
                  (p) => p.userId === msg.userId,
                );
                if (player) {
                  const maxFoldOrderNumber = Math.max(
                    ...draft.players.map((p) => p.foldOrderNumber ?? 0),
                  );
                  player.foldOrderNumber = maxFoldOrderNumber + 1;
                }
              },
            ),
          );
          break;

        case WsEventType.GAME_FIRST_FOLD_PROCESSED:
          console.log("First fold processed", msg.payload);
          toast(msg.payload, { icon: "🎉" });
          setFirstFoldedUserId(msg.userId);
          break;

        default:
          break;
      }
    },
    [dispatch, lobbyId, navigate, user?.userId],
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
      if (!connected || !userCards || disableCards) return;
      setChosenCardIdx(idx);
      send("/app/lobby/selectCard", { chosenCardIndex: idx });
    },
    [connected, userCards, disableCards, send],
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

    // sync last swap timestamp
    // console.log(
    //   `last swap: ${freshLobby.lastSwapTimestamp} (${(Date.now() - freshLobby.lastSwapTimestamp!) / 1000}s ago)`,
    // );
    if (freshLobby.lastSwapTimestamp) {
      setLastSwapTimestamp(freshLobby.lastSwapTimestamp);
    }

    // sync first folded
    const firstFoldedUserId = freshLobby.players.find(
      (p) => p.foldOrderNumber === 1,
    )?.userId;
    if (firstFoldedUserId) {
      setFirstFoldedUserId(firstFoldedUserId);
    }

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
        {isErrorCachedLobby && (
          <div className="text-red-500 text-center">
            <h5>
              Error loading lobby data: {formatApiError(errorCachedLobby)}
            </h5>
            <a href="/">Go back</a>
          </div>
        )}
      </PageLayout.Header>

      <PageLayout.Body className="flex flex-col items-center justify-center gap-5">
        <GameTable
          players={displayPlayers.filter((p) => p.userId !== user?.userId)}
          iconRotation={roundNumber * (360 / cachedLobby.players.length)}
        />

        {!firstFoldedUserId && !folded && (
          <div className="px-4 w-full">
            <ProgressBar
              className="my-2"
              progress={progress}
              animated
              label={`${((progress / 100) * lobby.moveTimeout).toFixed(1)}s left`}
            />
          </div>
        )}

        <div className="flex gap-3">
          {folded ? (
            <div className="text-center">
              <h2>You have folded and took #{foldOrderNumber} place</h2>
              <h4 className="text-muted">Waiting for others...</h4>
            </div>
          ) : userCards ? (
            userCards.map((card, i) => (
              <PlayingCard
                key={i}
                card={card}
                selected={!disableCards && i === chosenCardIdx}
                onClick={() => chooseCard(i)}
                className={clsx(
                  highlightCards && !folded && "highlight-card",
                  disableCards && "brightness-50",
                  foldError && "shake",
                )}
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
            className={clsx(
              "w-full py-4 transition-all",
              highlightFold &&
                !folded && [
                  "highlight-button",
                  "ring-2 ring-amber-400",
                  "bg-amber-500 text-black hover:bg-amber-400",
                ],
              foldError && "shake",
            )}
            onClick={foldCards}
            disabled={folded || foldCooldown}
          >
            BOLOTO
          </Button>
        </div>
      </PageLayout.Footer>
    </PageLayout>
  );
};

export default GamePage;
