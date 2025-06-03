import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Trophy, TrendingUp, TrendingDown, Users, MessageCircle } from "lucide-react";

interface FantasyTeam {
  id: number;
  teamName: string;
  wins: number;
  losses: number;
  ties: number;
  pointsFor: string;
  pointsAgainst: string;
  standing: number;
  league: {
    name: string;
    sport: string;
    platform: string;
  };
}

export default function Dashboard() {
  const { user } = useAuth();
  
  const { data: teams = [], isLoading } = useQuery({
    queryKey: ["/api/teams"],
  });

  const { data: leagues = [] } = useQuery({
    queryKey: ["/api/leagues"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getTeamPerformanceColor = (team: FantasyTeam) => {
    const winPercentage = team.wins / (team.wins + team.losses + team.ties);
    if (winPercentage >= 0.7) return "text-green-600";
    if (winPercentage >= 0.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getTeamTrend = (team: FantasyTeam) => {
    const pointsFor = parseFloat(team.pointsFor);
    const pointsAgainst = parseFloat(team.pointsAgainst);
    return pointsFor > pointsAgainst ? "up" : "down";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Fantasy Sports Hub</h1>
              <p className="text-gray-600">Welcome back, {user?.firstName || 'Manager'}</p>
            </div>
            <Button onClick={() => window.location.href = '/api/logout'} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Teams</p>
                <p className="text-2xl font-bold text-gray-900">{teams.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Winning Teams</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teams.filter((team: FantasyTeam) => team.wins > team.losses).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Leagues</p>
                <p className="text-2xl font-bold text-gray-900">{leagues.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teams.reduce((sum: number, team: FantasyTeam) => sum + parseFloat(team.pointsFor || "0"), 0).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Fantasy Teams</h2>
            <Button onClick={() => window.location.href = '/teams/add'}>
              Add New Team
            </Button>
          </div>

          {teams.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Fantasy Teams Yet</h3>
              <p className="text-gray-600 mb-6">
                Connect your fantasy sports accounts to see all your teams in one place
              </p>
              <Button onClick={() => window.location.href = '/teams/add'}>
                Add Your First Team
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team: FantasyTeam) => (
                <div key={team.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{team.teamName}</h3>
                        <p className="text-sm text-gray-600">
                          {team.league?.name} • {team.league?.sport} • {team.league?.platform}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {getTeamTrend(team) === "up" ? (
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Record:</span>
                        <span className={`font-medium ${getTeamPerformanceColor(team)}`}>
                          {team.wins}-{team.losses}{team.ties > 0 && `-${team.ties}`}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Standing:</span>
                        <span className="font-medium text-gray-900">#{team.standing || 'N/A'}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Points For:</span>
                        <span className="font-medium text-gray-900">{team.pointsFor}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Points Against:</span>
                        <span className="font-medium text-gray-900">{team.pointsAgainst}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        View Stats
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        League Chat
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <Users className="h-4 w-4 mr-2" />
              View All Leagues
            </Button>
            <Button variant="outline" className="justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              Weekly Reports
            </Button>
            <Button variant="outline" className="justify-start">
              <MessageCircle className="h-4 w-4 mr-2" />
              League Chats
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}