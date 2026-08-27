# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
bun install
```

### Development

Start the development server with HMR:

```bash
bun run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
bun run build
```

## CI/CD (GitHub Actions + Vercel)

Pull requests and pushes to `main` run typecheck and a production build. After those checks pass, PRs get a Vercel preview and merges to `main` deploy to production.

### GitHub secrets

Create a Vercel project for this repo, then add these repository secrets:

| Secret | Where to find it |
| --- | --- |
| `VERCEL_TOKEN` | [Vercel account tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | `.vercel/project.json` after `vercel link`, or Team Settings → Team ID |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` after `vercel link`, or Project Settings → General |

Set `VITE_API_URL` on the Vercel project (Preview and Production). Optionally set the same value as a GitHub Actions variable so CI builds match.

If you also connect the Vercel GitHub integration, disable Vercel’s automatic Git builds (Project Settings → Git → Ignored Build Step: `exit 0`) so only this workflow deploys.

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `bun run build`

```
├── package.json
├── bun.lock
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
