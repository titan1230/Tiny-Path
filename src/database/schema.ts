import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  serial,
  varchar,
  index,
  uuid,
} from "drizzle-orm/pg-core"
import type { AdapterAccountType } from "@auth/core/adapters"

export const ACCOUNT_TYPE_ENUM = pgEnum("accountType", [
  "Basic",
  "Premium"
]);

export const URL_TYPE_ENUM = pgEnum('urlType', [
  'permanent',
  'temp'
]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  accountType: ACCOUNT_TYPE_ENUM("accountType").default("Basic"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
})

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
)

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
)

export const urls = pgTable('urls',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    originalUrl: text('original_url').notNull(),
    shortUrl: varchar('short_url', { length: 8 }).notNull().unique(),
    urlType: URL_TYPE_ENUM('url_type').notNull().default('temp'),
    expiresAt: timestamp('expires_at'),
    userId: varchar('user_id', { length: 255 }).references(() => users.id, { onDelete: 'cascade' }),
    clicks: integer('clicks').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (urls) => [
    index('short_url_idx').on(urls.shortUrl),
    index('user_id_idx').on(urls.userId),
    index('expires_at_idx').on(urls.expiresAt),
  ]
);

export const analytics = pgTable('analytics', {
  id: serial('id').primaryKey(),
  urlId: uuid('url_id')
    .notNull()
    .references(() => urls.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'set null' }),
  clickedAt: timestamp('clicked_at').defaultNow().notNull(),
  ip: text('ip'),
  country: text('country'),
  device: text('device'),
  browser: text('browser'),
  isBounce: boolean('is_bounce').default(true),
});

export const trees = pgTable(
  "trees",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    username: varchar("username", { length: 100 }).notNull(),
    avatar: text("avatar"),
    background: text("background")
      .notNull()
      .default("bg-gradient-to-br from-purple-400 via-pink-500 to-red-500"),
    title: varchar("title", { length: 255 }),
    description: text("description"),
    isPublic: boolean("is_public").notNull().default(true),
    isActive: boolean("is_active").notNull().default(true),
    viewCount: integer("view_count").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("slug_idx").on(table.slug),
    index("tree_user_id_idx").on(table.userId),
  ]
);

export const links = pgTable(
  "links",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    treeId: uuid("tree_id")
      .notNull()
      .references(() => trees.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    url: text("url").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    order: integer("order").notNull().default(0),
    backgroundColor: varchar("background_color", { length: 50 }),
    textColor: varchar("text_color", { length: 50 }),
    borderRadius: varchar("border_radius", { length: 20 }),
    clickCount: integer("click_count").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("tree_id_idx").on(table.treeId),
    index("order_idx").on(table.order),
  ]
);

export const tree_analytics = pgTable(
  "tree_analytics",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    treeId: uuid("tree_id")
      .notNull()
      .references(() => trees.id, { onDelete: "cascade" }),
    linkId: uuid("link_id").references(() => links.id, { onDelete: "cascade" }),
    eventType: varchar("event_type", { length: 20 }).notNull(),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    referer: text("referer"),
    country: varchar("country", { length: 2 }),
    city: varchar("city", { length: 100 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("analytics_tree_id_idx").on(table.treeId),
    index("analytics_link_id_idx").on(table.linkId),
    index("analytics_event_type_idx").on(table.eventType),
    index("analytics_created_at_idx").on(table.createdAt),
  ]
);