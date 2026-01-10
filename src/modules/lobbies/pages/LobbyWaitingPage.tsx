import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router";
import Header from "src/modules/common/components/Header";
import { useAppSelector } from "src/store";
import { Button } from "src/ui/components/Button";
import ConnectionIcon from "src/ui/components/ConnectionIcon";
import PageLayout from "src/ui/components/PageLayout";
import {
  useGetCachedLobbyQuery,
  useGetLobbyQuery,
  useLeaveLobbyMutation,
  useStartLobbyMutation,
} from "../api/lobbies";
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
  const { data: cachedLobby, isLoading: isLoadingCachedLobby } =
    useGetCachedLobbyQuery(lobbyId, {
      skip: !isAuth || Number.isNaN(lobbyId),
      pollingInterval: 5000,
    });

  const isHost = useMemo(() => {
    return cachedLobby?.hostUserId === user?.userId;
  }, [cachedLobby, user]);

  useEffect(() => {
    if (cachedLobby && cachedLobby.lobbyState !== "LS_WAITING_FOR_PLAYERS") {
      navigate(`/game/${lobbyId}`, { replace: true });
    }
  }, [cachedLobby, lobbyId, navigate]);

  // sockets
  const connected = true;

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
          rightSlot={<ConnectionIcon connected={connected} />}
        />

        <div className="flex flex-col items-center justify-center text-center px-6 pt-12 gap-10 flex-1">
          <PlayersGrid
            players={cachedLobby.players || []}
            hostUserId={cachedLobby.hostUserId}
          />
        </div>

        <PageLayout.Sticky className="w-full flex justify-center">
          <LobbyStatusInfo
            className="max-w-50 bg-surface-alt px-4 py-3 rounded-t-xl"
            current={cachedLobby.players.length ?? 0}
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
