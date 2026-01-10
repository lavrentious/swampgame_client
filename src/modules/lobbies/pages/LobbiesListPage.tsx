import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import { useNavigate } from "react-router";
import { formatApiError } from "src/modules/common/api/utils";
import IconButton from "src/modules/common/components/IconButton";
import MainLayout from "src/modules/common/components/MainLayout";
import { useAppSelector } from "src/store";
import { Button } from "src/ui/components/Button";
import ConnectionIcon from "src/ui/components/ConnectionIcon";
import { Spinner } from "src/ui/components/Spinner";
import { useGetLobbiesWithCacheQuery } from "../api/lobbies";
import LobbyListItem from "../components/LobbyListItem";
import { useGlobalLobbyStomp } from "../hooks/useGlobalLobbyStomp";

const LobbiesListPage = () => {
  const navigate = useNavigate();

  const isAuth = useAppSelector((s) => s.auth.isAuthenticated);

  const {
    data: lobbies,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetLobbiesWithCacheQuery(void 0, {
    skip: !isAuth,
    pollingInterval: 5000,
  });

  const renderCentered = (content: React.ReactNode) => (
    <div className="flex flex-1 items-center justify-center">{content}</div>
  );

  const { connected } = useGlobalLobbyStomp();

  return (
    <MainLayout
      title="Lobbies"
      leftSlot={isLoading && <Spinner size="sm" />}
      rightSlot={
        <div className="flex items-center gap-2">
          <IconButton
            size="sm"
            icon={<FiRefreshCw />}
            disabled={isLoading || isFetching}
            onClick={() => {
              toast.promise(refetch(), {
                loading: "Refreshing lobbies...",
                success: "Lobbies refreshed",
                error: "Failed to refresh lobbies",
              });
            }}
          />
          <ConnectionIcon connected={connected} />
        </div>
      }
      showMenu
      footer={
        <div className="p-4">
          <Button
            className="w-full flex items-center justify-center gap-2"
            onClick={() => navigate("/create-lobby")}
          >
            <FaPlus />
            Create Lobby
          </Button>
        </div>
      }
    >
      {isLoading && renderCentered(<Spinner />)}

      {isError &&
        renderCentered(
          <div className="text-center text-red-500">
            {error ? formatApiError(error) : "Failed to load lobbies"}
          </div>,
        )}

      {!isLoading &&
        !isError &&
        lobbies?.length === 0 &&
        renderCentered(
          <div className="text-center text-muted-foreground">No lobbies</div>,
        )}

      {!isLoading && !isError && lobbies && lobbies.length > 0 && (
        <div className="p-4 space-y-2">
          {lobbies.map((l) => (
            <LobbyListItem
              key={l.lobby.id}
              lobby={l.lobby}
              cachedLobby={l.cached}
            />
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default LobbiesListPage;
