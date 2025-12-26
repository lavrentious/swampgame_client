import { useNavigate } from "react-router";
import { Button } from "src/ui/components/Button";
import PageLayout from "src/ui/components/PageLayout";
import { Player } from "../api/types";
import PlayersGrid from "../components/LobbyPlayersGrid";
import LobbyStatusInfo from "../components/LobbyStatusInfo";

const players: Player[] = [
  { id: 1, firstName: "Igor" },
  { id: 2, firstName: "Andrey" },
  { id: 3, firstName: "lavrent", isHost: true },
  { id: 4, firstName: "elypsoeed" },
  { id: 5, isWaiting: true },
  { id: 6, isWaiting: true },
];

const LobbyWaitingPage = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <PageLayout.Header>
        <h1 className="text-2xl font-bold text-center mt-20">
          About to start ...
        </h1>
      </PageLayout.Header>
      <PageLayout.Body>
        <div className="flex flex-col items-center justify-center text-center px-6 pt-12 gap-10">
          <PlayersGrid players={players} />

          <LobbyStatusInfo current={4} max={6} isHost />
        </div>
      </PageLayout.Body>

      <PageLayout.Footer>
        <div className="p-4">
          <Button
            className="w-full py-4 text-lg rounded-xl"
            onClick={() => navigate("/game")}
          >
            Start
          </Button>
        </div>
      </PageLayout.Footer>
    </PageLayout>
  );
};

export default LobbyWaitingPage;
