import dotenv from 'dotenv';
dotenv.config();

// You can enable support for commands by uncommenting the import below
//If you don't want to support commands, you could delete the necessary files (found in commands directory)
import './commands/deploy-commands';

// Require the necessary discord.js classes
import { Client, GatewayIntentBits } from 'discord.js';
import { getConfig } from './getConfig';
import EventHandler from './eventHandler';
import MusicQueue from './musicQueue';

const DISCORD_TOKEN = getConfig().DISCORD_TOKEN;

// Create a new client instance with intents
// Check what intents is needed via https://discord.com/developers/docs/topics/gateway#gateway-intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
});

const eventHandler = new EventHandler(client);
eventHandler.initEvents();

MusicQueue.getInstance()
  .getUpdate()
  .subscribe((data) => {
    //Check if we are already in a VC - If not, join VC, if we are, do nothing and return early
    //If we are not in a VC, connect to VC
    //Start playing song in queue
    //Once song is finished, pop the song from the queue and go to next one
  });

// Login to Discord with your client's token
client.login(DISCORD_TOKEN).catch((error) => {
  console.log(error);
});
