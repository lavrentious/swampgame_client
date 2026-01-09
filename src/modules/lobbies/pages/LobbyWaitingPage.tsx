import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { HiSignal, HiSignalSlash } from "react-icons/hi2";
import { Link, useNavigate, useParams } from "react-router";
import Header from "src/modules/common/components/Header";
import { useStomp } from "src/modules/game/hooks/useStomp";
import { useAppSelector } from "src/store";
import { Button } from "src/ui/components/Button";
import PageLayout from "src/ui/components/PageLayout";
import {
  useGetCachedLobbyQuery,
  useGetLobbyQuery,
  useLeaveLobbyMutation,
  useStartLobbyMutation,
} from "../api/lobbies";
import { LobbyWsMessage } from "../api/types";
import PlayersGrid from "../components/LobbyPlayersGrid";
import LobbyStatusInfo from "../components/LobbyStatusInfo";

const LobbyWaitingPage = () => {
  const navigate = useNavigate();
  const [leaveLobby] = useLeaveLobbyMutation();
  const [startLobby] = useStartLobbyMutation();

  const { id } = useParams<{ id?: string }>();
  const lobbyId = id ? Number(id) : NaN;
  useEffect(() => {
    if (!id || Number.isNaN(lobbyId)) {
      navigate("/", { replace: true });
    }
  }, [id, lobbyId, navigate]);

  const user = useAppSelector((s) => s.auth.user);
  const userState = useAppSelector((state) => state.app.userState);
  const [players, setPlayers] = useState<
    { userId: number; displayName: string }[] | null
  >(null);

  useEffect(() => {
    if (
      userState &&
      userState.status === "in_lobby" &&
      userState.lobbyId !== lobbyId
    ) {
      toast.error("You are not in this lobby");
      navigate("/", { replace: true });
    }
  }, [userState, lobbyId, navigate]);

  const isAuth = useAppSelector((s) => s.auth.isAuthenticated);

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

  useEffect(() => {
    if (!cachedLobby) return;
    console.log("cached lobby updated, updating local players...");
    setPlayers(
      cachedLobby.players.map((p) => ({
        userId: p.userId,
        displayName: p.displayName,
      })),
    );
  }, [cachedLobby]);

  const isHost = useMemo(() => {
    return cachedLobby?.hostUserId === user?.userId;
  }, [cachedLobby, user]);

  useEffect(() => {
    if (cachedLobby && cachedLobby.lobbyState !== "LS_WAITING_FOR_PLAYERS") {
      navigate(`/game/${lobbyId}`, { replace: true });
    }
  }, [cachedLobby, lobbyId, navigate]);

  // sockets
  const onSocketMsg = useCallback(
    (msg: LobbyWsMessage) => {
      console.log("lobby msg", msg);
      if (msg.lobbyId !== lobbyId) return;
      if (msg.eventType === "PLAYER_JOINED_LOBBY") {
        setPlayers((prev) => {
          if (!prev) return prev;
          return [
            ...prev,
            {
              userId: msg.userId,
              displayName: msg.displayName,
            },
          ];
        });
      } else if (msg.eventType === "PLAYER_LEFT_LOBBY") {
        setPlayers((prev) => {
          if (!prev) return prev;
          return prev.filter((p) => p.userId !== msg.userId);
        });
      }
    },
    [lobbyId],
  );

  const jwt = useAppSelector((state) => state.auth.accessToken!);
  const { connected } = useStomp({
    url: `/topic/lobbies`,
    onMessage: onSocketMsg,
    jwt,
    skip: !isAuth || Number.isNaN(lobbyId),
  });

  useEffect(() => {
    if (connected) {
      refetchCachedLobby();
    }
  }, [connected, refetchCachedLobby]);

  // render
  if (
    !user ||
    ((!lobby || !cachedLobby) && (isLoadingLobby || isLoadingCachedLobby))
  ) {
    return (
      <PageLayout>
        <PageLayout.Body>
          <h1 className="text-2xl font-bold text-center mt-20">Loading...</h1>
        </PageLayout.Body>
      </PageLayout>
    );
  } else if (!lobby || !cachedLobby) {
    return (
      <PageLayout>
        <PageLayout.Body>
          <h1 className="text-2xl font-bold text-center mt-20">Error</h1>
          <Link
            to="/"
            className="text-blue-500 hover:text-blue-600 hover:underline"
          >
            Go back
          </Link>
        </PageLayout.Body>
      </PageLayout>
    );
  }

  return (
    <PageLayout className="relative">
      <PageLayout.Body className="flex flex-col">
        <Header
          title={lobby.name}
          showBackButton
          onBackClick={() => {
            console.log("leaving lobby...");
            leaveLobby({ lobbyId, userId: user.userId })
              .unwrap()
              .then(() => {
                toast.success("left lobby");
                navigate("/");
              })
              .catch((e) => {
                console.error("error while leaving", e);
              });
          }}
          backPath="/lobbies"
          showUserPfp={false}
          rightSlot={
            connected ? (
              <HiSignal className="text-green-500" />
            ) : (
              <HiSignalSlash className="text-red-500" />
            )
          }
        />

        <div className="flex flex-col items-center justify-center text-center px-6 pt-12 gap-10 flex-1">
          <PlayersGrid
            players={players || []}
            hostUserId={cachedLobby.hostUserId}
          />
        </div>

        <PageLayout.Sticky className="w-full flex justify-center">
          <LobbyStatusInfo
            className="max-w-50 bg-surface-alt px-4 py-3 rounded-t-xl"
            current={players?.length ?? 0}
            max={lobby.capacity}
            isHost={isHost}
          />
        </PageLayout.Sticky>
      </PageLayout.Body>

      {
        <PageLayout.Footer className="bg-surface-alt">
          <div className="p-4">
            {isHost ? (
              <Button
                className="w-full py-4 text-lg rounded-xl"
                onClick={() => {
                  console.log("starting lobby...");
                  startLobby({
                    lobbyId: lobby.id,
                    hostUserId: user.userId,
                  })
                    .unwrap()
                    .then(() => {
                      toast.success("lobby started");
                    });
                }}
              >
                Start
              </Button>
            ) : (
              <h6 className="text-center">
                Waiting for host to start the game...
              </h6>
            )}
          </div>
        </PageLayout.Footer>
      }
    </PageLayout>
  );
};

export default LobbyWaitingPage;
