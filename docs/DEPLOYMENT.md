# Deployment checklist

1. Deploy the backend from `backend/` with Node 24, `pnpm install --frozen-lockfile`, and `pnpm start`.
2. Set `MONGO_URI`, a random `JWT_SECRET` of at least 32 characters, `NODE_ENV=production`,
   `CORS_ORIGIN=https://YOUR-FRONTEND-HOST`, `RATE_LIMIT_STORE=upstash`,
   `UPSTASH_REDIS_REST_URL`, and `UPSTASH_REDIS_REST_TOKEN`.
3. Verify the proxy topology before setting `TRUST_PROXY`. Rate limits on authentication
   use the client IP and depend on this configuration being accurate. Auth allows 10/minute;
   authenticated API requests allow 100/minute/user. Store outages return 503.
4. Deploy the frontend from `frontend/` with `pnpm install --frozen-lockfile`,
   `pnpm build`, output `dist/`, and `VITE_API_URL=/api`.
5. Proxy `/api/*` to the backend preserving the path, Origin, Cookie, and Set-Cookie headers.
   Handle SPA routes with an index.html fallback *after* the API proxy.
6. Use `/api/health` as the backend readiness check.
7. Verify registration, refresh, sign-out, and rejection of a foreign Origin through the public frontend host.

## Migration from the original Task Manager deployment

The previous frontend used bearer tokens and called Render directly. This version uses cookies.
Frontend and backend must be released together, and VITE_API_URL must become /api.
Users will need to sign in again. No user/password data migration is required.
Task Manager's checked-in frontend/vercel.json targets the backend URL documented in its original README.
If using another backend or a preview environment, change the proxy target before deploying.
For a generic starter deployment, configure your host's reverse proxy with your own backend URL.

The repository changes do not alter hosting environment variables or release a deployment.
Do a preview release before merging a change that triggers automatic production deployment.
