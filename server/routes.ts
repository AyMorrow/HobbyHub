import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertLeagueSchema, insertFantasyTeamSchema, insertChatMessageSchema, insertWeeklyStatsSchema } from "../shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // League routes
  app.get('/api/leagues', isAuthenticated, async (req, res) => {
    try {
      const leagues = await storage.getLeagues();
      res.json(leagues);
    } catch (error) {
      console.error("Error fetching leagues:", error);
      res.status(500).json({ message: "Failed to fetch leagues" });
    }
  });

  app.post('/api/leagues', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertLeagueSchema.parse(req.body);
      const league = await storage.createLeague(validatedData);
      res.json(league);
    } catch (error) {
      console.error("Error creating league:", error);
      res.status(400).json({ message: "Failed to create league" });
    }
  });

  app.get('/api/leagues/:id', isAuthenticated, async (req, res) => {
    try {
      const leagueId = parseInt(req.params.id);
      const league = await storage.getLeague(leagueId);
      if (!league) {
        return res.status(404).json({ message: "League not found" });
      }
      res.json(league);
    } catch (error) {
      console.error("Error fetching league:", error);
      res.status(500).json({ message: "Failed to fetch league" });
    }
  });

  // Fantasy team routes
  app.get('/api/teams', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const teams = await storage.getUserFantasyTeams(userId);
      res.json(teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });

  app.post('/api/teams', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertFantasyTeamSchema.parse({
        ...req.body,
        userId
      });
      const team = await storage.createFantasyTeam(validatedData);
      res.json(team);
    } catch (error) {
      console.error("Error creating team:", error);
      res.status(400).json({ message: "Failed to create team" });
    }
  });

  app.get('/api/leagues/:id/teams', isAuthenticated, async (req, res) => {
    try {
      const leagueId = parseInt(req.params.id);
      const teams = await storage.getTeamsByLeague(leagueId);
      res.json(teams);
    } catch (error) {
      console.error("Error fetching league teams:", error);
      res.status(500).json({ message: "Failed to fetch league teams" });
    }
  });

  // Chat routes
  app.get('/api/leagues/:id/chat', isAuthenticated, async (req, res) => {
    try {
      const leagueId = parseInt(req.params.id);
      const messages = await storage.getLeagueChatMessages(leagueId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post('/api/leagues/:id/chat', isAuthenticated, async (req: any, res) => {
    try {
      const leagueId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const validatedData = insertChatMessageSchema.parse({
        ...req.body,
        leagueId,
        userId
      });
      const message = await storage.createChatMessage(validatedData);
      res.json(message);
    } catch (error) {
      console.error("Error creating chat message:", error);
      res.status(400).json({ message: "Failed to create chat message" });
    }
  });

  // Weekly stats routes
  app.get('/api/teams/:id/stats', isAuthenticated, async (req, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const stats = await storage.getTeamWeeklyStats(teamId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching team stats:", error);
      res.status(500).json({ message: "Failed to fetch team stats" });
    }
  });

  app.post('/api/teams/:id/stats', isAuthenticated, async (req: any, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const validatedData = insertWeeklyStatsSchema.parse({
        ...req.body,
        teamId
      });
      const stats = await storage.createWeeklyStats(validatedData);
      res.json(stats);
    } catch (error) {
      console.error("Error creating team stats:", error);
      res.status(400).json({ message: "Failed to create team stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}