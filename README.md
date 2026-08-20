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