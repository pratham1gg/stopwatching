# Stopwatch With Lap Notes

A Next.js stopwatch app with lap tracking, lap notes, Markdown session export, and optional GitHub push.

## Project structure

- `/app` - Next.js app router files
- `/components` - UI and feature components
- `/hooks` - reusable React hooks
- `/lib` - utility functions and types
- `/public` - static assets
- `Dockerfile` - production container build
- `docker-compose.yml` - local container run
- `.dockerignore` - Docker build context exclusions

## Deploy on Vercel (recommended)

1. Push this folder to a GitHub repository.
2. In Vercel, click **Add New Project** and import the repo.
3. Keep framework preset as **Next.js**.
4. Deploy.

Vercel does not require Docker for this project. It will use `next build` directly.

## Run with Docker (optional)

Build and run with Compose:

```bash
docker compose up --build
```

App will be available at [http://localhost:3000](http://localhost:3000).

## Notes

- `next.config.mjs` is configured with `output: "standalone"` so Docker images can run efficiently.
- If you want stricter production safety, set `typescript.ignoreBuildErrors` to `false` before deploying.
