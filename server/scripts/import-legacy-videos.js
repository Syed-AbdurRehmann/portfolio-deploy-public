import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import Database from "better-sqlite3";

const projectRoot = process.cwd();
const legacyVideosPath = path.resolve(projectRoot, "src", "data", "videos.ts");
const dbDir = path.resolve(projectRoot, "server", "data");
const dbPath = path.join(dbDir, "portfolio.db");

const ensureSchema = (db) => {
  db.exec(`
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
};

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
    throw new Error(`Could not find source file at ${legacyVideosPath}`);
  }

  const source = fs.readFileSync(legacyVideosPath, "utf8");
  const match = source.match(/export const videos: Video\[\]\s*=\s*(\[[\s\S]*?\]);/);

  if (!match) {
    throw new Error("Could not parse videos array from src/data/videos.ts");
  }

  const parsed = vm.runInNewContext(match[1], Object.create(null), { timeout: 1000 });

  if (!Array.isArray(parsed)) {
    throw new Error("Parsed legacy videos is not an array");
  }

  return parsed;
};

const main = () => {
  fs.mkdirSync(dbDir, { recursive: true });

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  ensureSchema(db);

  const legacyVideos = readLegacyVideos();
  const existingRows = db.prepare("select id from videos").all();
  const existingIds = new Set(existingRows.map((row) => row.id));

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

  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  const runImport = db.transaction((items) => {
    items.forEach((video) => {
      if (!video?.id || !video?.title || !video?.googleDriveLink || !video?.category) {
        skipped += 1;
        return;
      }

      if (existingIds.has(video.id)) {
        updated += 1;
      } else {
        inserted += 1;
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

  runImport(legacyVideos);

  const total = db.prepare("select count(*) as count from videos").get()?.count || 0;
  db.close();

  console.log(`[seed] legacy videos processed: ${legacyVideos.length}`);
  console.log(`[seed] inserted: ${inserted}`);
  console.log(`[seed] updated: ${updated}`);
  console.log(`[seed] skipped: ${skipped}`);
  console.log(`[seed] total videos in database: ${total}`);
};

try {
  main();
} catch (error) {
  console.error("[seed] failed to import legacy videos");
  console.error(error);
  process.exit(1);
}
