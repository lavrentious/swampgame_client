import { useCallback, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { HiSignal, HiSignalSlash } from "react-icons/hi2";
import { useNavigate } from "react-router";
import { formatApiError } from "src/modules/common/api/utils";
import MainLayout from "src/modules/common/components/MainLayout";
import { useStomp } from "src/modules/game/hooks/useStomp";
import { useAppSelector } from "src/store";
import { Button } from "src/ui/components/Button";
import { Checkbox } from "src/ui/components/form/Checkbox";
import { Spinner } from "src/ui/components/Spinner";
import { useGetLobbiesQuery } from "../api/lobbies";
import LobbyListItem from "../components/LobbyListItem";

const LobbiesListPage = () => {
  const [showOfflineLobbies, setShowOfflineLobbies] = useState(false);

  const navigate = useNavigate();
  const isAuth = useAppSelector((s) => s.auth.isAuthenticated);

  const {
    data: lobbies,
    isLoading,
    isError,
    error,
  } = useGetLobbiesQuery(void 0, { skip: !isAuth });

  const renderCentered = (content: React.ReactNode) => (
    <div className="flex flex-1 items-center justify-center">{content}</div>
  );

  const onSocketMsg = useCallback((msg: object) => {
    console.log(msg);
  }, []);
  const jwt = useAppSelector((s) => s.auth.accessToken!);
  const { connected } = useStomp({
    url: "/topic/lobbies",
    onMessage: onSocketMsg,
    jwt,
    parseJson: false,
    skip: !isAuth,
  });

  return (
    <MainLayout
      title="Lobbies"
      header={
        <>
          <div className="px-5 py-2 bg-surface-alt rounded-xl mb-5">
            <h2 className="text-lg font-semibold">Filters</h2>
            <hr />
            <div className="mt-5">
              <Checkbox
                label="Show offline lobbies"
                checked={showOfflineLobbies}
                onChange={(e) => setShowOfflineLobbies(e.target.checked)}
              />
            </div>
          </div>
          <hr />
        </>
      }
      rightSlot={
        connected ? (
          <HiSignal className="text-green-500" />
        ) : (
          <HiSignalSlash className="text-red-500" />
        )
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
          {lobbies.map((lobby) => (
            <LobbyListItem
              key={lobby.id}
              lobby={lobby}
              showOfflineLobbies={showOfflineLobbies}
            />
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default LobbiesListPage;
