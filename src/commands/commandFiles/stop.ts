import { getVoiceConnection } from '@discordjs/voice';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import MusicQueue from '../../musicQueue';

export const data = new SlashCommandBuilder()
  .setName('stop')
  .setDescription('Stops current song and deletes queue');

export const execute = async (interaction: ChatInputCommandInteraction) => {
  if (!interaction.guildId) {
    interaction.reply('Something went wrong... ErrorCode: 2');
    return;
  }

  const connection = getVoiceConnection(interaction.guildId);

  if (!connection) {
    interaction.reply('I am not playing any songs');
    return;
  }

  connection.destroy();
  connection.removeAllListeners();
  MusicQueue.getInstance().reset();
};
