import { Button } from "@/components/ui/button";
import { Trophy, BarChart3, MessageSquare, Calendar, TrendingUp, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Fantasy Sports Hub</h1>
            </div>
            <Button onClick={() => window.location.href = '/api/login'}>
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Manage All Your
            <span className="text-blue-600"> Fantasy Teams</span>
            <br />in One Place
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect your fantasy sports accounts from ESPN, Yahoo, Sleeper, and more. 
            Get comprehensive reports, league chat, and team performance insights all in one dashboard.
          </p>
          <Button 
            size="lg" 
            onClick={() => window.location.href = '/api/login'}
            className="px-8 py-4 text-lg"
          >
            Get Started Free
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg border">
            <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Unified Dashboard
            </h3>
            <p className="text-gray-600">
              See all your fantasy teams from different platforms in one clean, organized view. 
              Track wins, losses, standings, and points across all your leagues.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border">
            <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Performance Reports
            </h3>
            <p className="text-gray-600">
              Get weekly and yearly performance reports. Identify which teams need attention 
              and which ones are dominating their leagues.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border">
            <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              League Chat
            </h3>
            <p className="text-gray-600">
              Centralized chat for all your leagues. Never miss the trash talk or important 
              league announcements again.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border">
            <div className="bg-yellow-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Weekly Tracking
            </h3>
            <p className="text-gray-600">
              Automatic weekly stats tracking. See how each team performed week by week 
              and identify trends over time.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border">
            <div className="bg-red-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
              <Users className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Multi-Platform Support
            </h3>
            <p className="text-gray-600">
              Works with ESPN, Yahoo Sports, Sleeper, and other major fantasy sports platforms. 
              Connect all your accounts seamlessly.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border">
            <div className="bg-indigo-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
              <Trophy className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Championship Insights
            </h3>
            <p className="text-gray-600">
              Get insights into which teams have the best shot at championships and 
              where you might need to make strategic moves.
            </p>
          </div>
        </div>

        {/* Supported Platforms */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8">
            Supports Your Favorite Fantasy Platforms
          </h3>
          <div className="flex flex-wrap justify-center items-center space-x-8 text-gray-500">
            <div className="text-lg font-medium">ESPN</div>
            <div className="text-lg font-medium">Yahoo Sports</div>
            <div className="text-lg font-medium">Sleeper</div>
            <div className="text-lg font-medium">NFL.com</div>
            <div className="text-lg font-medium">CBS Sports</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Streamline Your Fantasy Sports Management?
          </h3>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of fantasy managers who use our platform to stay on top of all their leagues.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => window.location.href = '/api/login'}
            className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100"
          >
            Start Managing Your Teams
          </Button>
        </div>
      </div>
    </div>
  );
}