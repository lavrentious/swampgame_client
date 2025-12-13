import { useCallback, useEffect, useState } from "react";
import { Button, Container, Form, ListGroup } from "react-bootstrap";
import { useCreateRoomMutation, useLazyGetRoomsQuery } from "../api";
import { Room } from "../api/types";
import { useStomp } from "../utils/useStomp";

const LobbyPage: React.FC = () => {
  const [playerName, setPlayerName] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");
  const [numPlayers, setNumPlayers] = useState<number>(0);

  const { connected } = useStomp(
    "/topic/rooms",
    useCallback((msg) => {
      console.log(msg);
      setRooms(msg as Room[]);
    }, []),
  );
  const [createRoomMutation] = useCreateRoomMutation();
  const createRoom: React.FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      if (!connected) {
        console.warn("Not connected yet");
        return;
      }
      // send("/app/room.create", {
      //   roomName,
      //   creatorId: playerName,
      //   maxPlayers: numPlayers,
      // });
      createRoomMutation({
        roomName,
        creatorId: playerName,
        maxPlayers: numPlayers,
      });
    },
    [connected, createRoomMutation, roomName, playerName, numPlayers],
  );
  const [fetch] = useLazyGetRoomsQuery();
  const [rooms, setRooms] = useState<Room[] | null>(null);
  useEffect(() => {
    if (connected) {
      fetch()
        .unwrap()
        .then((rooms) => {
          setRooms(rooms);
          console.log("fetched rooms", rooms);
        });
    }
  }, [connected, fetch]);

  return (
    <Container>
      <p>ws status: {connected ? "Connected" : "Not connected"}</p>
      <Form onSubmit={createRoom}>
        <Form.Control
          type="text"
          placeholder="Player name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <Form.Control
          type="text"
          placeholder="Room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <Form.Control
          type="number"
          placeholder="Number of players"
          value={numPlayers}
          onChange={(e) => setNumPlayers(parseInt(e.target.value))}
        />
        <Button type="submit">Create room</Button>
      </Form>

      <ListGroup>
        {rooms?.map((room) => (
          <ListGroup.Item key={room.roomId}>
            [{room.roomId}] {room.roomName}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default LobbyPage;
