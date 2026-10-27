import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS stadiums (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    city TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    stadium_id INTEGER NOT NULL REFERENCES stadiums(id)
);

CREATE TABLE IF NOT EXISTS competitions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    team_id INTEGER NOT NULL REFERENCES teams(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    supported_team_id INTEGER NOT NULL REFERENCES teams(id),
    match_date TEXT NOT NULL,
    competition_id INTEGER NOT NULL REFERENCES competitions(id),
    home_team_id INTEGER NOT NULL REFERENCES teams(id),
    away_team_id INTEGER NOT NULL REFERENCES teams(id),
    home_score INTEGER NOT NULL CHECK (home_score BETWEEN 0 AND 99),
    away_score INTEGER NOT NULL CHECK (away_score BETWEEN 0 AND 99),
    stadium_id INTEGER NOT NULL REFERENCES stadiums(id),
    ticket_price REAL NOT NULL CHECK (ticket_price >= 0),
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    CHECK (home_team_id <> away_team_id),
    CHECK (supported_team_id IN (home_team_id, away_team_id))
);

CREATE TABLE IF NOT EXISTS password_resets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at INTEGER NOT NULL,
    used_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS emails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipient TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    link TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE INDEX IF NOT EXISTS index_matches_user_date ON matches(user_id, match_date);
CREATE INDEX IF NOT EXISTS index_emails_created ON emails(created_at DESC);
`;

function open() {
  const directory = path.join(process.cwd(), "data");
  mkdirSync(directory, { recursive: true });

  const database = new DatabaseSync(path.join(directory, "caderno.db"));
  database.exec("PRAGMA foreign_keys = ON");
  database.exec(SCHEMA);
  return database;
}

const db = globalThis.cadernoDb ?? open();

if (process.env.NODE_ENV !== "production") {
  globalThis.cadernoDb = db;
}

export default db;
