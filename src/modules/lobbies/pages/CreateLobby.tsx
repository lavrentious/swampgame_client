import { useCallback, useState } from "react";
import Header from "src/modules/common/components/Header";
import { Button } from "src/ui/components/Button";
import { Input } from "src/ui/components/form/Input";
import { Slider } from "src/ui/components/form/Slider";
import PageLayout from "src/ui/components/PageLayout";

const CreateLobby = () => {
  const [lobbyName, setLobbyName] = useState("");
  const [playersAmount, setPlayersAmount] = useState(4);
  const [lobbyTimeout, setLobbyTimeout] = useState(15);

  const onSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const data = {
        lobbyName,
        playersAmount,
        lobbyTimeout,
      };
      console.log("submit data", data);
    },
    [lobbyName, lobbyTimeout, playersAmount],
  );

  return (
    <PageLayout>
      <PageLayout.Header>
        <Header title="Create Lobby" backPath="/" />
      </PageLayout.Header>
      <PageLayout.Body>
        <form className="p-4 flex flex-col gap-4" onSubmit={onSubmit}>
          <Input
            placeholder="Enter lobby name"
            label="Lobby name"
            value={lobbyName}
            onChange={(e) => setLobbyName(e.target.value)}
          />

          <Slider
            min={4}
            max={13}
            label={`Players amount: ${playersAmount}`}
            value={playersAmount}
            onChange={setPlayersAmount}
          />

          <Slider
            min={1}
            max={30}
            label={`Timeout: ${lobbyTimeout}sec`}
            value={lobbyTimeout}
            onChange={setLobbyTimeout}
          />
        </form>
      </PageLayout.Body>
      <PageLayout.Footer>
        <div className="p-4">
          <Button className="w-full" onClick={onSubmit}>
            Create
          </Button>
        </div>
      </PageLayout.Footer>
    </PageLayout>
  );
};

export default CreateLobby;
