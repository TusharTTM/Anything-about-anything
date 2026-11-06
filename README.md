# Anything — about anything

An AI-workspace home page: a calm, dark interface for asking questions, writing, planning, and building — with the familiar shape of a modern AI app.

![Anything](app/icon.svg)

## What's inside

- **Home** — a greeting, a large prompt composer, and four "start with a spark" cards that fill the composer with a useful prompt.
- **Chats** — sending a message opens a conversation view with a thinking state, formatted answers, code blocks with copy, feedback actions, and regenerate.
- **Sidebar** — new chat, search, recents grouped by day, collapsible on desktop, and an off-canvas drawer on mobile.
- **Command palette** — `⌘K` / `Ctrl+K` to search chats, jump into a recent conversation, or send a new prompt.
- **Composer extras** — attach files, toggle tools (web search, deep think, create image), auto-growing textarea, and Enter-to-send.
- **Model picker** — switch between Anything 1.5, Anything 1.5 Pro, and Anything Mini.

## Stack

- [Next.js](https://nextjs.org/) (App Router) + React + TypeScript
- Tailwind CSS
- lucide-react icons
- Inter + Instrument Serif via Fontsource

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build
npm run start
```

Responses in this demo are generated locally from `lib/data.ts`, so no API key is required. The UI is ready to be wired to a real model endpoint.
