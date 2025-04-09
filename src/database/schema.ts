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
import type { AdapterAccountType } from "next-auth/adapters"

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
    shortUrl: varchar('short_url', { length: 6 }).notNull().unique(),
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