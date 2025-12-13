import { useRawInitData } from "@telegram-apps/sdk-react";
import axios, { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import toast from "react-hot-toast";

const MainPage = () => {
  const [jwt, setJwt] = useState<string | null>(null);

  const testFetch = useCallback(
    () =>
      axios
        .get((import.meta.env.VITE_API_BASE_URL ?? "") + "/auth")
        .then((r) => {
          console.log(r);
        }),
    [],
  );

  const testServer = useCallback(() => {
    toast.promise(testFetch(), {
      loading: "loading",
      success: "server ok",
      error: "no connection",
    });
  }, [testFetch]);

  const initDataRaw = useRawInitData();
  console.log(initDataRaw);

  const testInitData = useCallback(() => {
    axios
      .post((import.meta.env.VITE_API_BASE_URL ?? "") + "/auth/telegram", {
        data: initDataRaw,
      })
      .then((r) => {
        toast.success(JSON.stringify(r.data));
        setJwt(r.data as string);
      })
      .catch((e) => {
        toast.error(JSON.stringify(e));
      });
  }, [initDataRaw]);

  const testJwt = useCallback(() => {
    axios
      .post((import.meta.env.VITE_API_BASE_URL ?? "") + "/auth/validate", jwt)
      .then((r) => {
        toast.success(JSON.stringify(r.data));
      })
      .catch((e: AxiosError) => {
        toast.error(JSON.stringify(e.response?.data));
      });
  }, [jwt]);

  return (
    <Container>
      <div className="d-flex gap-2">
        <Button onClick={testServer}>test server</Button>
        <Button onClick={testInitData}>test init data</Button>
        <Button onClick={testJwt} disabled={!jwt}>
          test jwt
        </Button>
      </div>
      <div>
        <div className="d-flex gap-2">
          <Form.Group className="d-flex flex-column">
            <Form.Label>JWT</Form.Label>
            <Form.Control
              as="textarea"
              value={jwt || ""}
              onChange={(e) => setJwt(e.target.value)}
              rows={5}
            />
          </Form.Group>
        </div>
      </div>
    </Container>
  );
};

export default MainPage;
