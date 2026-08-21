import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { config } from "./config.js";
import {
  addExecution,
  getMember,
  listExecutions,
  listMembers,
  redeemKey,
  resetHwid,
  setMember,
} from "./store.js";

export const commandDefinitions = [
  new SlashCommandBuilder()
    .setName("panel")
    .setDescription("Open the secure script control panel"),
  new SlashCommandBuilder()
    .setName("stats")
    .setDescription("View script activity totals"),
  new SlashCommandBuilder()
    .setName("logs")
    .setDescription("View recent execution audit events"),
  new SlashCommandBuilder()
    .setName("allow")
    .setDescription("Allow a member to access owned scripts")
    .addUserOption((option) =>
      option.setName("user").setDescription("Member to allow").setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  new SlashCommandBuilder()
    .setName("block")
    .setDescription("Block a member from accessing owned scripts")
    .addUserOption((option) =>
      option.setName("user").setDescription("Member to block").setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  new SlashCommandBuilder()
    .setName("redeem")
    .setDescription("Redeem an access key")
    .addStringOption((option) =>
      option.setName("key").setDescription("Your access key").setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName("reset-hwid")
    .setDescription("Reset your saved device binding"),
].map((command) => command.toJSON());

function panelButtons() {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel("View panel")
      .setStyle(ButtonStyle.Link)
      .setURL(config.panelUrl),
    new ButtonBuilder()
      .setCustomId("panel_stats")
      .setLabel("Stats")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("panel_logs")
      .setLabel("Execution log")
      .setStyle(ButtonStyle.Secondary),
  );
}

export async function handleCommand(
  interaction: import("discord.js").ChatInputCommandInteraction,
) {
  if (interaction.commandName === "panel") {
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("Script Control Panel")
      .setDescription(
        "Manage software you own, review access decisions, and keep an auditable execution history.",
      )
      .addFields(
        { name: "Allowed members", value: String(listMembers().filter((m) => m.status === "allowed").length), inline: true },
        { name: "Blocked members", value: String(listMembers().filter((m) => m.status === "blocked").length), inline: true },
        { name: "Audit events", value: String(listExecutions().length), inline: true },
      )
      .setFooter({ text: "Access decisions are logged." });

    await interaction.reply({ embeds: [embed], components: [panelButtons()] });
    return;
  }

  if (interaction.commandName === "stats") {
    await interaction.reply({
      ephemeral: true,
      content: `Allowed: ${listMembers().filter((m) => m.status === "allowed").length} · Blocked: ${listMembers().filter((m) => m.status === "blocked").length} · Audit events: ${listExecutions().length}`,
    });
    return;
  }

  if (interaction.commandName === "logs") {
    const logs = listExecutions().slice(0, 8);
    const content = logs.length
      ? logs
          .map((event) => `${event.status.toUpperCase()} · ${event.script} · ${event.username}`)
          .join("\n")
      : "No execution events have been recorded yet.";
    await interaction.reply({ ephemeral: true, content });
    return;
  }

  if (interaction.commandName === "allow" || interaction.commandName === "block") {
    if (interaction.user.id !== config.ownerId && !interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
      await interaction.reply({ ephemeral: true, content: "You do not have permission to manage access." });
      return;
    }
    const user = interaction.options.getUser("user", true);
    const status = interaction.commandName === "allow" ? "allowed" : "blocked";
    setMember(user.id, user.username, status, "Member");
    await interaction.reply({ content: `${user} is now ${status}.`, ephemeral: true });
    return;
  }

  if (interaction.commandName === "redeem") {
    const key = interaction.options.getString("key", true).trim();
    const accepted = redeemKey(key);
    if (accepted) {
      setMember(interaction.user.id, interaction.user.username, "allowed", "Member");
    }
    await interaction.reply({
      ephemeral: true,
      content: accepted ? "Key redeemed. Your access has been recorded." : "That key is invalid or has already been redeemed.",
    });
    return;
  }

  if (interaction.commandName === "reset-hwid") {
    const exists = resetHwid(interaction.user.id);
    await interaction.reply({
      ephemeral: true,
      content: exists ? "Your device binding reset request was recorded." : "No device binding was found for your account.",
    });
  }
}

export async function handleButton(interaction: import("discord.js").ButtonInteraction) {
  if (interaction.customId === "panel_stats") {
    await interaction.reply({
      ephemeral: true,
      content: `Allowed: ${listMembers().filter((m) => m.status === "allowed").length} · Blocked: ${listMembers().filter((m) => m.status === "blocked").length}`,
    });
  }
  if (interaction.customId === "panel_logs") {
    await interaction.reply({
      ephemeral: true,
      content: listExecutions().slice(0, 5).map((event) => `${event.status} · ${event.script} · ${event.username}`).join("\n") || "No audit events yet.",
    });
  }
}

export function recordExecution(script: string, userId: string, username: string) {
  const access = getMember(userId);
  const status = access?.status === "allowed" ? "success" : "denied";
  addExecution({ script, userId, username, status, createdAt: new Date().toISOString() });
}