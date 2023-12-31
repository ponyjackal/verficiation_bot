import { Client, GatewayIntentBits } from "discord.js";
import {
  COMMANDS,
  deployApplicationCommands,
  deployGuildCommands,
  handleCommand,
} from "~lib/command";
import { token, developmentGuild, owner } from "~secret/discord.json";
import log from "~lib/log";

import * as robotevents from "robotevents";
import { bearer } from "~secret/robotevents.json";
robotevents.authentication.setBearer(bearer);

// Register all of the commands
import "./commands";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
  ],
});

client.on("ready", async () => {
  log(
    "info",
    `${client.user?.username}#${client.user?.discriminator} is ready!`
  );

  if (process.env.NODE_ENV === "development") {
    log(
      "info",
      `deploying ${COMMANDS.size} commands (${[...COMMANDS.keys()].join(
        ", "
      )}) to development guild...`
    );
    deployGuildCommands(developmentGuild);
  } else {
    log("info", `deploying ${COMMANDS.size} commands to GLOBAL list...`);
    deployApplicationCommands();
  }
});

client.on("interactionCreate", handleCommand);
client.login(token);

export { client };
