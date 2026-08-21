import "dotenv/config";

const required = ["DISCORD_TOKEN", "DISCORD_CLIENT_ID", "OWNER_ID"] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing ${key}. Copy .env.example to .env and set it.`);
  }
}

export const config = {
  token: process.env.DISCORD_TOKEN!,
  clientId: process.env.DISCORD_CLIENT_ID!,
  guildId: process.env.DISCORD_GUILD_ID,
  ownerId: process.env.OWNER_ID!,
  panelUrl: process.env.PANEL_URL ?? "http://localhost:5173",
};