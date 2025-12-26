import { useRawInitData } from "@telegram-apps/sdk-react";
import axios, { AxiosError } from "axios";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import Header from "src/modules/common/components/Header";
import { Button } from "src/ui/components/Button";
import { Input } from "src/ui/components/form/Input";
import PageLayout from "src/ui/components/PageLayout";

const TestPage = () => {
  const [jwt, setJwt] = useState<string | null>(null);
  // axios.defaults.withCredentials = true;

  const testFetch = useCallback(
    () =>
      axios
        .get((import.meta.env.VITE_API_BASE_URL ?? "") + "/auth/")
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
        setJwt(r.data.jwt as string);
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
    <PageLayout>
      <PageLayout.Header>
        <Header title="test" backPath="/" />
      </PageLayout.Header>
      <PageLayout.Body className="p-5">
        <div className="d-flex gap-2">
          <Button onClick={testServer}>test server</Button>
          <Button onClick={testInitData}>test init data</Button>
          <Button onClick={testJwt} disabled={!jwt}>
            test jwt
          </Button>
        </div>
        <div>
          <div className="d-flex gap-2">
            <form className="d-flex flex-column">
              <label>JWT</label>
              <Input
                value={jwt || ""}
                onChange={(e) => setJwt(e.target.value)}
              />
            </form>
          </div>
        </div>
      </PageLayout.Body>
    </PageLayout>
  );
};

export default TestPage;
