import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Fantasy leagues
export const leagues = pgTable("leagues", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  platform: varchar("platform", { length: 50 }).notNull(), // 'ESPN', 'Yahoo', 'Sleeper', etc.
  sport: varchar("sport", { length: 50 }).notNull(), // 'NFL', 'NBA', 'MLB', etc.
  season: varchar("season", { length: 10 }).notNull(), // '2024', '2023-24', etc.
  leagueId: varchar("league_id").notNull(), // External league ID from platform
  settings: jsonb("settings"), // Platform-specific settings
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User's fantasy teams
export const fantasyTeams = pgTable("fantasy_teams", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").notNull().references(() => users.id),
  leagueId: integer("league_id").notNull().references(() => leagues.id),
  teamName: varchar("team_name", { length: 255 }).notNull(),
  teamId: varchar("team_id").notNull(), // External team ID from platform
  wins: integer("wins").default(0),
  losses: integer("losses").default(0),
  ties: integer("ties").default(0),
  pointsFor: decimal("points_for", { precision: 10, scale: 2 }).default("0"),
  pointsAgainst: decimal("points_against", { precision: 10, scale: 2 }).default("0"),
  standing: integer("standing"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// League chat messages
export const chatMessages = pgTable("chat_messages", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  leagueId: integer("league_id").notNull().references(() => leagues.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Weekly performance data
export const weeklyStats = pgTable("weekly_stats", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  teamId: integer("team_id").notNull().references(() => fantasyTeams.id),
  week: integer("week").notNull(),
  year: integer("year").notNull(),
  points: decimal("points", { precision: 10, scale: 2 }).notNull(),
  opponentPoints: decimal("opponent_points", { precision: 10, scale: 2 }),
  result: varchar("result", { length: 10 }), // 'W', 'L', 'T'
  createdAt: timestamp("created_at").defaultNow(),
});

// Platform connections for API access
export const platformConnections = pgTable("platform_connections", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").notNull().references(() => users.id),
  platform: varchar("platform", { length: 50 }).notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  fantasyTeams: many(fantasyTeams),
  chatMessages: many(chatMessages),
  platformConnections: many(platformConnections),
}));

export const leaguesRelations = relations(leagues, ({ many }) => ({
  fantasyTeams: many(fantasyTeams),
  chatMessages: many(chatMessages),
}));

export const fantasyTeamsRelations = relations(fantasyTeams, ({ one, many }) => ({
  user: one(users, {
    fields: [fantasyTeams.userId],
    references: [users.id],
  }),
  league: one(leagues, {
    fields: [fantasyTeams.leagueId],
    references: [leagues.id],
  }),
  weeklyStats: many(weeklyStats),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
  league: one(leagues, {
    fields: [chatMessages.leagueId],
    references: [leagues.id],
  }),
}));

export const weeklyStatsRelations = relations(weeklyStats, ({ one }) => ({
  team: one(fantasyTeams, {
    fields: [weeklyStats.teamId],
    references: [fantasyTeams.id],
  }),
}));

export const platformConnectionsRelations = relations(platformConnections, ({ one }) => ({
  user: one(users, {
    fields: [platformConnections.userId],
    references: [users.id],
  }),
}));

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type League = typeof leagues.$inferSelect;
export type FantasyTeam = typeof fantasyTeams.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type WeeklyStats = typeof weeklyStats.$inferSelect;
export type PlatformConnection = typeof platformConnections.$inferSelect;

// Insert schemas
export const insertLeagueSchema = createInsertSchema(leagues, {
  name: z.string().min(1, "League name is required"),
  platform: z.string().min(1, "Platform is required"),
  sport: z.string().min(1, "Sport is required"),
  season: z.string().min(1, "Season is required"),
  leagueId: z.string().min(1, "League ID is required"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFantasyTeamSchema = createInsertSchema(fantasyTeams, {
  teamName: z.string().min(1, "Team name is required"),
  teamId: z.string().min(1, "Team ID is required"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages, {
  message: z.string().min(1, "Message cannot be empty"),
}).omit({
  id: true,
  createdAt: true,
});

export const insertWeeklyStatsSchema = createInsertSchema(weeklyStats, {
  points: z.string().min(1, "Points are required"),
}).omit({
  id: true,
  createdAt: true,
});

export const insertPlatformConnectionSchema = createInsertSchema(platformConnections, {
  platform: z.string().min(1, "Platform is required"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Insert types
export type InsertLeague = z.infer<typeof insertLeagueSchema>;
export type InsertFantasyTeam = z.infer<typeof insertFantasyTeamSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type InsertWeeklyStats = z.infer<typeof insertWeeklyStatsSchema>;
export type InsertPlatformConnection = z.infer<typeof insertPlatformConnectionSchema>;