import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { setUserState } from "src/modules/app/store/appSlice";
import MainLayout from "src/modules/common/components/MainLayout";
import { useAppDispatch, useAppSelector } from "src/store";
import { Checkbox } from "src/ui/components/form/Checkbox";
import { Input } from "src/ui/components/form/Input";
import { Slider } from "src/ui/components/form/Slider";
import LoadingButton from "src/ui/components/LoadingButton";
import { useCreateLobbyMutation } from "../api/lobbies";

const CreateLobby = () => {
  const [lobbyName, setLobbyName] = useState("");
  const [playersAmount, setPlayersAmount] = useState(4);
  const [lobbyTimeout, setLobbyTimeout] = useState(15);
  const [lobbyPrivate, setLobbyPrivate] = useState<boolean>(false);
  const [lobbyPassword, setLobbyPassword] = useState<string>("");

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const userId = useAppSelector((state) => state.auth.user?.userId);

  const [createLobby, { isLoading }] = useCreateLobbyMutation();

  const onSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();

      if (!userId) return;

      const data = {
        lobbyName,
        playersAmount,
        lobbyTimeout,
      };
      console.log("submit data", data);
      createLobby({
        name: lobbyName,
        hostUserId: userId,
        capacity: playersAmount,
        moveTimeout: lobbyTimeout,
        isPrivate: lobbyPrivate,
        password: lobbyPrivate ? lobbyPassword : undefined,
      })
        .unwrap()
        .then((res) => {
          dispatch(setUserState({ status: "in_lobby", lobbyId: res.lobbyId }));
          toast.success(`lobby #${res.lobbyId} created`);
          navigate(`/lobby/${res.lobbyId}`);
        });
    },
    [
      createLobby,
      dispatch,
      lobbyName,
      lobbyPassword,
      lobbyPrivate,
      lobbyTimeout,
      navigate,
      playersAmount,
      userId,
    ],
  );

  return (
    <MainLayout
      title="Create Lobby"
      showBackButton
      backPath="/"
      footer={
        <div className="p-4">
          <LoadingButton
            isLoading={isLoading}
            className="w-full"
            onClick={onSubmit}
          >
            Create
          </LoadingButton>
        </div>
      }
    >
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

        <hr />

        <Checkbox
          label="Private"
          checked={lobbyPrivate}
          onChange={(e) => setLobbyPrivate(e.target.checked)}
        />
        {lobbyPrivate && (
          <Input
            placeholder="Enter lobby password"
            label="Lobby password"
            type="password"
            value={lobbyPassword}
            onChange={(e) => setLobbyPassword(e.target.value)}
          />
        )}
      </form>
    </MainLayout>
  );
};

export default CreateLobby;
