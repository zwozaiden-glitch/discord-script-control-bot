import { Client, GatewayIntentBits } from "discord.js";
import { config } from "./config.js";
import { handleButton, handleCommand } from "./commands.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      await handleCommand(interaction);
    } else if (interaction.isButton()) {
      await handleButton(interaction);
    }
  } catch (error) {
    console.error("Interaction failed", error);
    if (interaction.isRepliable() && !interaction.replied) {
      await interaction.reply({ ephemeral: true, content: "The bot could not complete that request." });
    }
  }
});

await client.login(config.token);