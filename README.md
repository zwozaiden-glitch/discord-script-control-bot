# Discord Script Control Bot

An upload-ready Discord bot starter for managing access to software you own. It provides a compact panel message, access allow/block commands, key redemption, HWID reset requests, and an in-memory execution audit stream.

This starter intentionally does not execute arbitrary code, hide payloads, bypass analysis, or implement exploit tooling. Connect the commands to your own authenticated service when you are ready for persistence and real script delivery.

## Requirements

- Node.js 20+
- A Discord application with a bot user
- The `applications.commands` scope

## Setup

```bash
cp .env.example .env
npm install
npm run register
npm run dev
```

For a production process:

```bash
npm run build
npm start
```

## Environment variables

See `.env.example`. Keep `.env` private and never commit it.

## Commands

- `/panel` — shows the control panel message and buttons
- `/stats` — shows access and audit totals
- `/logs` — shows recent audit events
- `/allow user:@member` — allows a member
- `/block user:@member` — blocks a member
- `/redeem key:BUYER-...` — redeems an access key
- `/reset-hwid` — records a device reset request

The in-memory store is deliberately small for a starter repository. Replace `src/store.ts` with PostgreSQL, Redis, or your service API before production use.

## Deploy on Railway

Create a Railway service from this GitHub repository. This is a worker process, so it does not need a public HTTP port.

Add these Railway variables:

```text
DISCORD_TOKEN
DISCORD_CLIENT_ID
DISCORD_GUILD_ID
OWNER_ID
PANEL_URL
```

Deploy once with the Railway build command:

```bash
npm run build
```

The service starts with:

```bash
node dist/index.js
```

Before the first deployment, run the command registration locally or as a one-time Railway command:

```bash
npm run register
```

After deployment, check the Railway logs for:

```text
Logged in as YourBotName
```