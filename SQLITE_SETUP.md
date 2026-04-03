# SQLite Backend Setup (Self-Hosted)

## 1. Configure Server Environment
1. Copy `.env.server.example` to `.env.server`.
2. Set secure values:

```bash
PORT=3001
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=12h
CORS_ORIGIN=http://localhost:8080
# Optional hard gate for first admin creation
ADMIN_SETUP_KEY=
```

## 2. Run Development

```bash
npm install
npm run dev
```

This runs:
- Vite frontend on `http://localhost:8080`
- Express API on `http://localhost:3001`

## 3. First-Time Admin Setup
1. Open `/admin` in the frontend.
2. If no admin exists, create the first admin account.
3. If `ADMIN_SETUP_KEY` is set, provide that key in the setup form.

## 4. Import Legacy Videos
To migrate your original static catalog into SQLite:

```bash
npm run seed:videos
```

The importer reads `src/data/videos.ts`, upserts by video `id`, and normalizes Google Drive links to preview format.

## 5. API Endpoints
- `GET /api/health`
- `GET /api/videos`
- `GET /api/admin/status`
- `POST /api/admin/setup`
- `POST /api/admin/login`
- `GET /api/admin/me`
- `POST /api/admin/logout`
- `GET /api/admin/videos`
- `POST /api/admin/videos`
- `PUT /api/admin/videos/:id`
- `DELETE /api/admin/videos/:id`

## 6. SQLite Data Location
Database file is created automatically at:

`server/data/portfolio.db`

## 7. Production Deployment
1. Build frontend:

```bash
npm run build
```

2. Run API/server (also serves `dist` if present):

```bash
npm start
```

## 8. Security Checklist
- Use a strong `JWT_SECRET`
- Restrict `CORS_ORIGIN` to your domain
- Put app behind HTTPS (Nginx/Caddy/Cloudflare)
- Keep `ADMIN_SETUP_KEY` set during initial provisioning
- Disable or rotate setup key after first admin creation
