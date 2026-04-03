import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const dbDir = path.resolve(process.cwd(), "server", "data");
const dbPath = path.join(dbDir, "portfolio.db");

fs.mkdirSync(dbDir, { recursive: true });

export const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
  create table if not exists admins (
    id integer primary key autoincrement,
    email text not null unique,
    password_hash text not null,
    created_at text not null default (datetime('now'))
  );

  create table if not exists videos (
    id text primary key,
    title text not null,
    google_drive_link text not null,
    category text not null,
    is_latest integer not null default 0,
    is_vertical integer not null default 1,
    description text,
    created_at text not null default (datetime('now')),
    updated_at text not null default (datetime('now'))
  );
`);

const mapVideoRow = (row) => ({
  id: row.id,
  title: row.title,
  googleDriveLink: row.google_drive_link,
  category: row.category,
  isLatest: Boolean(row.is_latest),
  isVertical: Boolean(row.is_vertical),
  description: row.description ?? "",
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const getAdminCount = () => {
  const row = db.prepare("select count(*) as count from admins").get();
  return Number(row?.count || 0);
};

export const getAdminByEmail = (email) => {
  return db.prepare("select id, email, password_hash from admins where email = ?").get(email);
};

export const createAdmin = ({ email, passwordHash }) => {
  db.prepare("insert into admins (email, password_hash) values (?, ?)").run(email, passwordHash);
};

export const getAllVideos = () => {
  const rows = db
    .prepare(
      "select id, title, google_drive_link, category, is_latest, is_vertical, description, created_at, updated_at from videos order by datetime(created_at) desc",
    )
    .all();

  return rows.map(mapVideoRow);
};

export const createVideo = ({ id, title, googleDriveLink, category, isLatest, isVertical, description }) => {
  db
    .prepare(
      `insert into videos (id, title, google_drive_link, category, is_latest, is_vertical, description)
       values (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(id, title, googleDriveLink, category, isLatest ? 1 : 0, isVertical ? 1 : 0, description || null);

  const row = db
    .prepare(
      "select id, title, google_drive_link, category, is_latest, is_vertical, description, created_at, updated_at from videos where id = ?",
    )
    .get(id);

  return mapVideoRow(row);
};

export const updateVideo = ({ id, title, googleDriveLink, category, isLatest, isVertical, description }) => {
  const result = db
    .prepare(
      `update videos
       set title = ?, google_drive_link = ?, category = ?, is_latest = ?, is_vertical = ?, description = ?, updated_at = datetime('now')
       where id = ?`,
    )
    .run(title, googleDriveLink, category, isLatest ? 1 : 0, isVertical ? 1 : 0, description || null, id);

  if (!result.changes) {
    return null;
  }

  const row = db
    .prepare(
      "select id, title, google_drive_link, category, is_latest, is_vertical, description, created_at, updated_at from videos where id = ?",
    )
    .get(id);

  return mapVideoRow(row);
};

export const removeVideo = (id) => {
  const result = db.prepare("delete from videos where id = ?").run(id);
  return Boolean(result.changes);
};
