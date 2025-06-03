import {
  users,
  leagues,
  fantasyTeams,
  chatMessages,
  weeklyStats,
  platformConnections,
  type User,
  type UpsertUser,
  type League,
  type FantasyTeam,
  type ChatMessage,
  type WeeklyStats,
  type PlatformConnection,
  type InsertLeague,
  type InsertFantasyTeam,
  type InsertChatMessage,
  type InsertWeeklyStats,
  type InsertPlatformConnection,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // League operations
  createLeague(league: InsertLeague): Promise<League>;
  getLeagues(): Promise<League[]>;
  getLeague(id: number): Promise<League | undefined>;
  
  // Fantasy team operations
  createFantasyTeam(team: InsertFantasyTeam): Promise<FantasyTeam>;
  getUserFantasyTeams(userId: string): Promise<FantasyTeam[]>;
  getTeamsByLeague(leagueId: number): Promise<FantasyTeam[]>;
  updateFantasyTeam(id: number, updates: Partial<InsertFantasyTeam>): Promise<FantasyTeam>;
  
  // Chat operations
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getLeagueChatMessages(leagueId: number, limit?: number): Promise<ChatMessage[]>;
  
  // Weekly stats operations
  createWeeklyStats(stats: InsertWeeklyStats): Promise<WeeklyStats>;
  getTeamWeeklyStats(teamId: number): Promise<WeeklyStats[]>;
  
  // Platform connection operations
  createPlatformConnection(connection: InsertPlatformConnection): Promise<PlatformConnection>;
  getUserPlatformConnections(userId: string): Promise<PlatformConnection[]>;
  updatePlatformConnection(id: number, updates: Partial<InsertPlatformConnection>): Promise<PlatformConnection>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // League operations
  async createLeague(league: InsertLeague): Promise<League> {
    const [newLeague] = await db.insert(leagues).values(league).returning();
    return newLeague;
  }

  async getLeagues(): Promise<League[]> {
    return await db.select().from(leagues).orderBy(desc(leagues.createdAt));
  }

  async getLeague(id: number): Promise<League | undefined> {
    const [league] = await db.select().from(leagues).where(eq(leagues.id, id));
    return league;
  }

  // Fantasy team operations
  async createFantasyTeam(team: InsertFantasyTeam): Promise<FantasyTeam> {
    const [newTeam] = await db.insert(fantasyTeams).values(team).returning();
    return newTeam;
  }

  async getUserFantasyTeams(userId: string): Promise<FantasyTeam[]> {
    return await db
      .select()
      .from(fantasyTeams)
      .where(eq(fantasyTeams.userId, userId))
      .orderBy(desc(fantasyTeams.createdAt));
  }

  async getTeamsByLeague(leagueId: number): Promise<FantasyTeam[]> {
    return await db
      .select()
      .from(fantasyTeams)
      .where(eq(fantasyTeams.leagueId, leagueId))
      .orderBy(fantasyTeams.standing);
  }

  async updateFantasyTeam(id: number, updates: Partial<InsertFantasyTeam>): Promise<FantasyTeam> {
    const [updatedTeam] = await db
      .update(fantasyTeams)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(fantasyTeams.id, id))
      .returning();
    return updatedTeam;
  }

  // Chat operations
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }

  async getLeagueChatMessages(leagueId: number, limit: number = 50): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.leagueId, leagueId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);
  }

  // Weekly stats operations
  async createWeeklyStats(stats: InsertWeeklyStats): Promise<WeeklyStats> {
    const [newStats] = await db.insert(weeklyStats).values(stats).returning();
    return newStats;
  }

  async getTeamWeeklyStats(teamId: number): Promise<WeeklyStats[]> {
    return await db
      .select()
      .from(weeklyStats)
      .where(eq(weeklyStats.teamId, teamId))
      .orderBy(weeklyStats.year, weeklyStats.week);
  }

  // Platform connection operations
  async createPlatformConnection(connection: InsertPlatformConnection): Promise<PlatformConnection> {
    const [newConnection] = await db.insert(platformConnections).values(connection).returning();
    return newConnection;
  }

  async getUserPlatformConnections(userId: string): Promise<PlatformConnection[]> {
    return await db
      .select()
      .from(platformConnections)
      .where(and(eq(platformConnections.userId, userId), eq(platformConnections.isActive, true)))
      .orderBy(desc(platformConnections.createdAt));
  }

  async updatePlatformConnection(id: number, updates: Partial<InsertPlatformConnection>): Promise<PlatformConnection> {
    const [updatedConnection] = await db
      .update(platformConnections)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(platformConnections.id, id))
      .returning();
    return updatedConnection;
  }
}

export const storage = new DatabaseStorage();