import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { z } from "zod";
import { createAdmin, createVideo, getAdminByEmail, getAdminCount, getAllVideos, removeVideo, updateVideo } from "./db.js";
import { generateAdminToken, hashPassword, verifyAdminToken, verifyPassword } from "./auth.js";

dotenv.config({ path: path.resolve(process.cwd(), ".env.server") });
dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);
const setupKey = process.env.ADMIN_SETUP_KEY || "";

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : true,
    credentials: false,
  }),
);
app.use(express.json({ limit: "2mb" }));

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

const setupSchema = loginSchema.extend({
  setupKey: z.string().optional(),
});

const videoPayloadSchema = z.object({
  title: z.string().trim().min(1).max(140),
  googleDriveLink: z.string().url().min(10),
  category: z.string().trim().min(1).max(64),
  isLatest: z.boolean(),
  isVertical: z.boolean(),
  description: z.string().max(1000).optional().default(""),
});

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

const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const token = authHeader.slice(7);
    const payload = verifyAdminToken(token);
    req.admin = payload;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

app.get("/api/health", (_req, res) => {
  return res.json({ ok: true, mode: "sqlite" });
});

app.get("/api/admin/status", (_req, res) => {
  return res.json({ hasAdmin: getAdminCount() > 0 });
});

app.post("/api/admin/setup", async (req, res) => {
  const parsed = setupSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid setup payload" });
  }

  if (getAdminCount() > 0) {
    return res.status(409).json({ error: "Admin account already exists" });
  }

  if (setupKey && parsed.data.setupKey !== setupKey) {
    return res.status(403).json({ error: "Invalid setup key" });
  }

  const passwordHash = await hashPassword(parsed.data.password);

  try {
    createAdmin({
      email: parsed.data.email.toLowerCase(),
      passwordHash,
    });
    return res.status(201).json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Unable to create admin" });
  }
});

app.post("/api/admin/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid login payload" });
  }

  const admin = getAdminByEmail(parsed.data.email.toLowerCase());
  if (!admin) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isValid = await verifyPassword(parsed.data.password, admin.password_hash);
  if (!isValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = generateAdminToken({ id: admin.id, email: admin.email });
  return res.json({
    token,
    user: {
      id: String(admin.id),
      email: admin.email,
    },
  });
});

app.post("/api/admin/logout", (_req, res) => {
  return res.json({ ok: true });
});

app.get("/api/admin/me", requireAdmin, (req, res) => {
  return res.json({
    user: {
      id: String(req.admin.adminId),
      email: req.admin.email,
    },
  });
});

app.get("/api/videos", (_req, res) => {
  return res.json({ videos: getAllVideos() });
});

app.get("/api/admin/videos", requireAdmin, (_req, res) => {
  return res.json({ videos: getAllVideos() });
});

app.post("/api/admin/videos", requireAdmin, (req, res) => {
  const parsed = videoPayloadSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid video payload" });
  }

  try {
    const created = createVideo({
      id: crypto.randomUUID(),
      ...parsed.data,
      googleDriveLink: normalizeDriveLink(parsed.data.googleDriveLink),
    });

    return res.status(201).json({ video: created });
  } catch {
    return res.status(500).json({ error: "Unable to create video" });
  }
});

app.put("/api/admin/videos/:id", requireAdmin, (req, res) => {
  const parsed = videoPayloadSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid video payload" });
  }

  const updated = updateVideo({
    id: req.params.id,
    ...parsed.data,
    googleDriveLink: normalizeDriveLink(parsed.data.googleDriveLink),
  });

  if (!updated) {
    return res.status(404).json({ error: "Video not found" });
  }

  return res.json({ video: updated });
});

app.delete("/api/admin/videos/:id", requireAdmin, (req, res) => {
  const removed = removeVideo(req.params.id);
  if (!removed) {
    return res.status(404).json({ error: "Video not found" });
  }

  return res.status(204).send();
});

const distPath = path.resolve(process.cwd(), "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get(/^(?!\/api).*/, (_req, res) => {
    return res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`[api] listening on http://localhost:${port}`);
});
