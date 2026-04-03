# Welcome to your Lovable project

## New Features Added

- Admin mode at `/admin` for video add/edit/delete
- Self-hosted API + SQLite-backed video source with fallback to local static data
- CV page at `/cv` with PDF download support
- Uploadable resume file support via `public/resume.pdf`

## Admin Setup (Self-Hosted SQLite)

1. Copy `.env.server.example` to `.env.server`
2. Fill server values:

```bash
PORT=3001
JWT_SECRET=your-strong-secret
JWT_EXPIRES_IN=12h
CORS_ORIGIN=http://localhost:8080
# ADMIN_SETUP_KEY is optional
```

3. Start app with `npm run dev` (runs API + web)
4. Open `/admin`, create first admin account, then sign in
5. See `SQLITE_SETUP.md` for details and production notes

Without API availability, public pages still use fallback static videos.

## Private Server Deployment (Coolify + Cloudflare)

Implementation scripts are now available in `scripts/`:

- `scripts/deploy.ps1` - orchestrates git push, DNS upsert, Coolify deploy trigger, and health checks
- `scripts/add-subdomain.ps1` - idempotent Cloudflare CNAME create/update for `*.aniweb.online`
- `scripts/add-subdomain.sh` - bash version of DNS helper

### 1. Create local deploy config

```powershell
Copy-Item .\secrets.local.example.json .\secrets.local.json
```

Fill `secrets.local.json` with your real tokens and IDs. This file is ignored by git.

### 2. Run deployment (checkpoint mode)

```powershell
.\scripts\deploy.ps1 -AppName portfolio -Subdomain portfolio -Branch main
```

This project now deploys with `dockerfile` build pack by default (uses root `Dockerfile`).

### 3. Run deployment non-interactively

```powershell
.\scripts\deploy.ps1 -AppName portfolio -Subdomain portfolio -Branch main -AutoApprove
```

### Useful flags

- `-SkipPush` to skip git push
- `-SkipDns` to skip Cloudflare DNS writes
- `-SkipCoolify` to run only source + DNS steps

After first successful production startup, run one-time seed if needed:

```powershell
npm run seed:videos
```

## Project info

**URL**: https://lovable.dev/projects/bb03c644-f49c-4d57-9c7d-aa577ea819df

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/bb03c644-f49c-4d57-9c7d-aa577ea819df) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/bb03c644-f49c-4d57-9c7d-aa577ea819df) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
