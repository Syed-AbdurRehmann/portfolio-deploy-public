import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
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

const legacyVideosPath = path.resolve(process.cwd(), "src", "data", "videos.ts");

const normalizeDriveLink = (link) => {
  const input = String(link || "").trim();
  if (!input) {
    return "";
  }

  try {
    const parsed = new URL(input);
    if (parsed.pathname.endsWith("/view")) {
      parsed.pathname = parsed.pathname.replace(/\/view$/, "/preview");
    }
    return parsed.toString();
  } catch {
    return input.replace(/\/view(\?.*)?$/, (_match, query = "") => `/preview${query}`);
  }
};

const readLegacyVideos = () => {
  if (!fs.existsSync(legacyVideosPath)) {
    return [];
  }

  const source = fs.readFileSync(legacyVideosPath, "utf8");
  const match = source.match(/export const videos: Video\[\]\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) {
    return [];
  }

  const parsed = vm.runInNewContext(match[1], Object.create(null), { timeout: 1000 });
  return Array.isArray(parsed) ? parsed : [];
};

const seedVideosIfEmpty = () => {
  const count = Number(db.prepare("select count(*) as count from videos").get()?.count || 0);
  if (count > 0) {
    return;
  }

  const legacyVideos = readLegacyVideos();
  if (!legacyVideos.length) {
    console.warn("[db] videos table is empty and no legacy source was found");
    return;
  }

  const upsertVideo = db.prepare(`
    insert into videos (id, title, google_drive_link, category, is_latest, is_vertical, description)
    values (?, ?, ?, ?, ?, ?, ?)
    on conflict(id) do update set
      title = excluded.title,
      google_drive_link = excluded.google_drive_link,
      category = excluded.category,
      is_latest = excluded.is_latest,
      is_vertical = excluded.is_vertical,
      description = excluded.description,
      updated_at = datetime('now')
  `);

  const runSeed = db.transaction((items) => {
    items.forEach((video) => {
      if (!video?.id || !video?.title || !video?.googleDriveLink || !video?.category) {
        return;
      }

      upsertVideo.run(
        video.id,
        video.title,
        normalizeDriveLink(video.googleDriveLink),
        video.category,
        video.isLatest ? 1 : 0,
        video.isVertical ? 1 : 0,
        video.description || null,
      );
    });
  });

  runSeed(legacyVideos);

  const seededCount = Number(db.prepare("select count(*) as count from videos").get()?.count || 0);
  console.log(`[db] seeded videos from legacy source: ${seededCount}`);
};

seedVideosIfEmpty();

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
