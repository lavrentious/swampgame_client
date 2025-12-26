import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router";
import MainLayout from "src/modules/common/components/MainLayout";
import { Button } from "src/ui/components/Button";
import { Lobby } from "../api/types";
import LobbyListItem from "../components/LobbyListItem";

const testRooms: Lobby[] = [
  {
    roomId: 1,
    roomName: "Kopytov Party",
    createdAt: "2025-12-13T12:00:00Z",
    creatorTgId: 123,
    currentPlayers: 3,
    maxPlayers: 5,
    players: [],
    status: "WAITING",
    hasPassword: false,
  },
  {
    roomId: 2,
    roomName: "Biden Party",
    createdAt: "2025-12-13T12:00:00Z",
    creatorTgId: 123,
    currentPlayers: 5,
    maxPlayers: 5,
    players: [],
    status: "IN_PROGRESS",
    hasPassword: true,
  },
  {
    roomId: 3,
    roomName: "Kripto Govno Party",
    createdAt: "2025-12-13T12:00:00Z",
    creatorTgId: 456,
    currentPlayers: 3,
    maxPlayers: 5,
    players: [],
    status: "WAITING",
    hasPassword: false,
  },
  {
    roomId: 4,
    roomName: "prikoling",
    createdAt: "2025-12-13T12:00:00Z",
    creatorTgId: 789,
    currentPlayers: 2,
    maxPlayers: 5,
    players: [],
    status: "WAITING",
    hasPassword: true,
  },
  {
    roomId: 5,
    roomName: "Lavrentious Party",
    createdAt: "2025-12-13T12:00:00Z",
    creatorTgId: 111,
    currentPlayers: 1,
    maxPlayers: 5,
    players: [],
    status: "WAITING",
    hasPassword: false,
  },
  {
    roomId: 6,
    roomName: "Trump Party",
    createdAt: "2025-12-13T12:00:00Z",
    creatorTgId: 222,
    currentPlayers: 4,
    maxPlayers: 5,
    players: [],
    status: "IN_PROGRESS",
    hasPassword: true,
  },
  {
    roomId: 7,
    roomName: "Party of 5 Stars",
    createdAt: "2025-12-13T12:00:00Z",
    creatorTgId: 333,
    currentPlayers: 2,
    maxPlayers: 5,
    players: [],
    status: "WAITING",
    hasPassword: false,
  },
  {
    roomId: 8,
    roomName: "Party of the Sun",
    createdAt: "2025-12-13T12:00:00Z",
    creatorTgId: 444,
    currentPlayers: 3,
    maxPlayers: 5,
    players: [],
    status: "IN_PROGRESS",
    hasPassword: true,
  },
  {
    roomId: 9,
    roomName: "Party of the Moon",
    createdAt: "2025-12-13T12:00:00Z",
    creatorTgId: 555,
    currentPlayers: 1,
    maxPlayers: 5,
    players: [],
    status: "WAITING",
    hasPassword: false,
  },
  {
    roomId: 10,
    roomName: "Party of the Stars",
    createdAt: "2025-12-13T12:00:00Z",
    creatorTgId: 666,
    currentPlayers: 4,
    maxPlayers: 5,
    players: [],
    status: "IN_PROGRESS",
    hasPassword: true,
  },
  {
    roomId: 11,
    roomName: "Party of the Universe",
    createdAt: "2025-12-13T12:00:00Z",
    creatorTgId: 777,
    currentPlayers: 5,
    maxPlayers: 5,
    players: [],
    status: "IN_PROGRESS",
    hasPassword: true,
  },
];

const LobbiesListPage = () => {
  const navigate = useNavigate();

  return (
    <MainLayout
      title="Lobbies"
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
      <div className="p-4 space-y-2">
        {testRooms.map((room) => (
          <LobbyListItem
            key={room.roomId}
            room={room}
            onClick={() => navigate(`/lobby-waiting`)}
          />
        ))}
      </div>
    </MainLayout>
  );
};

export default LobbiesListPage;
