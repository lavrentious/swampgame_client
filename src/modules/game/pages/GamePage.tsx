import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { HiSignal, HiSignalSlash } from "react-icons/hi2";
import { Navigate, useParams } from "react-router";
import Header from "src/modules/common/components/Header";
import {
  useGetCachedLobbyQuery,
  useGetLobbyQuery,
} from "src/modules/lobbies/api/lobbies";
import { useAppSelector } from "src/store";
import { Button } from "src/ui/components/Button";
import PageLayout from "src/ui/components/PageLayout";
import { useSwapCardsMutation } from "../api/game";
import { WsEventType, WsMessage } from "../api/types";
import PlayingCard from "../components/cards/PlayingCard";
import { Card } from "../components/cards/types";
import GameTable from "../components/GameTable";
import { useStomp } from "../hooks/useStomp";
import { parsePlainCard } from "../utils/game";

const GamePage = () => {
  const { id } = useParams<{ id?: string }>();
  const lobbyId = id ? Number(id) : NaN;

  const user = useAppSelector((s) => s.auth.user);
  const isAuth = useAppSelector((s) => s.auth.isAuthenticated);
  const jwt = useAppSelector((s) => s.auth.accessToken!);

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

  const [userCards, setUserCards] = useState<Card[] | null>(null);
  const [chosenCardIdx, setChosenCardIdx] = useState<number | null>(null);
  const [roundNumber, setRoundNumber] = useState(0);

  /* -------------------- refs used by socket -------------------- */

  const chooseCardRef = useRef<(idx: number) => void>(() => {});
  const chosenCardIdxRef = useRef<number | null>(null);

  useEffect(() => {
    chosenCardIdxRef.current = chosenCardIdx;
  }, [chosenCardIdx]);

  /* -------------------- derived state -------------------- */

  const folded = useMemo(() => {
    if (!cachedLobby || !user) return false;
    const currentPlayer = cachedLobby.players.find(
      (p) => p.userId === user.userId,
    );
    return currentPlayer?.foldOrderNumber != null;
  }, [cachedLobby, user]);

  /* -------------------- socket handler (NO deps) -------------------- */

  const onSocketMsg = useCallback((msg: WsMessage) => {
    switch (msg.eventType) {
      case WsEventType.PLAYER_RECIEVED_CARD: {
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

  const [swapCardsRequest] = useSwapCardsMutation();

  const swapCards = useCallback(() => {
    swapCardsRequest({ lobbyId })
      .unwrap()
      .then(() => {
        toast.success("Swapped cards");
        refetchCachedLobby();

        if (chosenCardIdxRef.current !== null) {
          chooseCardRef.current(chosenCardIdxRef.current);
        }
      })
      .catch(() => toast.error("Failed to swap cards"));
  }, [swapCardsRequest, lobbyId, refetchCachedLobby]);

  const foldCards = useCallback(() => {
    console.log("folding cards...");
    send("/app/lobby/fold", {});
  }, [send]);

  /* -------------------- effects -------------------- */

  useEffect(() => {
    if (!cachedLobby || !user) return;

    setRoundNumber((rn) => rn + 1);

    const currentPlayer = cachedLobby.players.find(
      (p) => p.userId === user.userId,
    );

    if (!currentPlayer?.hand) return;

    setUserCards(
      currentPlayer.hand.filter(Boolean).map((c) => parsePlainCard(c!.value)),
    );
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
          rightSlot={
            connected ? (
              <HiSignal className="text-green-500" />
            ) : (
              <HiSignalSlash className="text-red-500" />
            )
          }
        />
      </PageLayout.Header>

      <PageLayout.Body className="flex flex-col items-center justify-center gap-5 overflow-x-hidden">
        <GameTable
          players={cachedLobby.players.filter((p) => p.userId !== user?.userId)}
          iconRotation={roundNumber * 30}
        />

        <div className="text-white/80">
          time left: <strong className="text-white">12 sec</strong>
        </div>

        <div className="flex gap-3 max-w-full">
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
        <div className="p-4 flex gap-3">
          <Button
            className="w-full py-4"
            onClick={() => foldCards()}
            disabled={folded}
          >
            GOVNO
          </Button>
          <Button
            className="w-full py-4"
            variant="secondary"
            onClick={swapCards}
            disabled={folded}
          >
            Swap
          </Button>
        </div>
      </PageLayout.Footer>
    </PageLayout>
  );
};

export default GamePage;
