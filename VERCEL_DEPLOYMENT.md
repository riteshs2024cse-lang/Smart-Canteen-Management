# Vercel Deployment (React Frontend)

## What is configured
- Root `vercel.json` is configured to:
  - install frontend dependencies
  - build the React app from `frontend/`
  - serve `frontend/build`
  - support React Router via SPA rewrite to `/index.html`

## Required environment variable in Vercel
Add this in **Vercel Project Settings > Environment Variables**:

- `REACT_APP_API_URL` = `https://your-backend-domain/api`

## Deploy
1. Import this GitHub repository in Vercel.
2. Keep project root as repository root.
3. Deploy.

## Local build check
From `frontend/`:

```bash
npm run build
```

If build completes, Vercel build should also succeed with the same config.
