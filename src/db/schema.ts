import { pgTable, text, integer, timestamp, boolean, uuid, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	// Custom fields
	plan: text("plan").default("free"),
	deepWorkHours: integer("deep_work_hours").default(0),
	xp: integer("xp").default(0),
});

export const sessions = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull().references(() => users.id),
});

export const accounts = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull().references(() => users.id),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at"),
	updatedAt: timestamp("updated_at"),
});

// App specific tables

export const focusSessions = pgTable("focus_session", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id").notNull().references(() => users.id),
	startTime: timestamp("start_time").notNull(),
	endTime: timestamp("end_time"),
	duration: integer("duration"), // in minutes
	status: text("status").notNull().default("in_progress"), // in_progress, completed, abandoned
	moodStart: text("mood_start"),
	moodEnd: text("mood_end"),
	taskName: text("task_name").notNull(),
	notes: text("notes"),
	isBoosted: boolean("is_boosted").default(false),
	createdAt: timestamp("created_at").defaultNow(),
});

export const tasks = pgTable("task", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id").notNull().references(() => users.id),
	title: text("title").notNull(),
	description: text("description"),
	status: text("status").default("todo"), // todo, in_progress, done
	priority: text("priority").default("medium"), // low, medium, high
	dueDate: timestamp("due_date"),
	estimatedDuration: integer("estimated_duration"), // in minutes
	aiComplexityScore: integer("ai_complexity_score"),
	createdAt: timestamp("created_at").defaultNow(),
});

export const dailyStats = pgTable("daily_stats", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id").notNull().references(() => users.id),
	date: text("date").notNull(), // YYYY-MM-DD
	totalDeepWorkMinutes: integer("total_deep_work_minutes").default(0),
	sessionsCompleted: integer("sessions_completed").default(0),
	distractionCount: integer("distraction_count").default(0),
	moodScore: integer("mood_score"), // 1-10 average
});
