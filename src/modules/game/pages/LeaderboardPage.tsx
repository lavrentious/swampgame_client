import { Navigate, useLocation, useNavigate } from "react-router";
import Header from "src/modules/common/components/Header";
import { Button } from "src/ui/components/Button";
import PageLayout from "src/ui/components/PageLayout";
import { LeaderboardEntry } from "../api/types";

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const leaderboard = location.state as LeaderboardEntry[] | undefined;

  if (!leaderboard) {
    return <Navigate to="/" />;
  }

  const sorted = [...leaderboard].sort((a, b) => a.place - b.place);

  return (
    <PageLayout>
      <PageLayout.Header>
        <Header
          title="Leaderboard"
          size="sm"
          showBackButton={true}
          backPath="/"
        />
      </PageLayout.Header>

      <PageLayout.Body className="flex flex-col items-center gap-4 p-4">
        <div className="w-full max-w-md bg-white/5 rounded-lg overflow-hidden">
          {sorted.map((entry) => (
            <div
              key={entry.userId}
              className="flex justify-between items-center px-4 py-3 border-b border-white/10 last:border-b-0"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{entry.place}.</span>
                <span className="text-white/90">{entry.displayName}</span>
              </div>
              <div className="flex gap-4 text-white/70 text-sm">
                <span>💰 {entry.moneyEarned}</span>
                <span>⭐ {entry.expEarned}</span>
              </div>
            </div>
          ))}
        </div>
      </PageLayout.Body>

      <PageLayout.Footer>
        <div className="p-4 w-full">
          <Button className="w-full py-4" onClick={() => navigate("/")}>
            Home
          </Button>
        </div>
      </PageLayout.Footer>
    </PageLayout>
  );
};

export default LeaderboardPage;
