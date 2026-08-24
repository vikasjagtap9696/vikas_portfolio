## Vikas Dev Portfolio

This repository contains a React/Vite frontend and an Express/Sequelize backend.

### Structure

- `frontend/`: React, Vite, TypeScript, styles, and public assets
- `backend/`: Express API, Sequelize models, routes, and uploads
- `.env`: shared local and deployment environment variables

### Development

Install dependencies from the repository root:

```bash
npm install
```

Run the applications in separate terminals:

```bash
npm run dev:frontend
npm run dev:backend
```

Build and validate the frontend:

```bash
npm run build
npm run lint
```

Set database values and a strong `JWT_SECRET` in the root `.env` before deploying. Never commit `.env`.
