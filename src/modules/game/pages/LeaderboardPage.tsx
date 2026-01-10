import { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import Header from "src/modules/common/components/Header";
import { useGetCachedLobbyQuery } from "src/modules/lobbies/api/lobbies";
import { useAppSelector } from "src/store";
import { Button } from "src/ui/components/Button";
import PageLayout from "src/ui/components/PageLayout";
import { LeaderboardEntry } from "../api/types";

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const leaderboard = location.state as LeaderboardEntry[] | undefined;
  const { id } = useParams<{ id?: string }>();
  const lobbyId = id ? Number(id) : NaN;

  const isAuth = useAppSelector((s) => s.auth.isAuthenticated);

  const { data: cachedLobby } = useGetCachedLobbyQuery(lobbyId, {
    skip: !!leaderboard || !isAuth || Number.isNaN(lobbyId),
  });

  useEffect(() => {
    if (isNaN(lobbyId)) {
      navigate("/");
    }
  }, [lobbyId, navigate]);

  const sorted = useMemo<LeaderboardEntry[] | null>(() => {
    if (leaderboard) return [...leaderboard].sort((a, b) => a.place - b.place);
    if (!cachedLobby) return null;
    return cachedLobby.leaderboard
      .map((username) => {
        const player = cachedLobby.players.find(
          (p) => p.displayName === username,
        );
        if (!player) return null;
        return {
          displayName: player.displayName || username,
          expEarned: 0,
          moneyEarned: player.moneyEarned,
          place: cachedLobby.leaderboard.indexOf(username) + 1,
          userId: player.userId,
        } as LeaderboardEntry;
      })
      .filter((e) => e !== null);
  }, [cachedLobby, leaderboard]);

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
        {sorted ? (
          sorted.map((entry) => (
            <div className="w-full max-w-md bg-white/5 rounded-lg overflow-hidden">
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
            </div>
          ))
        ) : (
          <span className="text-muted">Leaderboard error</span>
        )}
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
