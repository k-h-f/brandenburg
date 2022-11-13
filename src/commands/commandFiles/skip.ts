import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import MusicQueue from '../../musicQueue';

export const data = new SlashCommandBuilder()
  .setName('skip')
  .setDescription('Skips the current song being played');

export const execute = async (interaction: ChatInputCommandInteraction) => {
  MusicQueue.getInstance().getMusicQueue()[0].stream.destroy();
  console.log('skip', MusicQueue.getInstance().getMusicQueue()[0].url);

  interaction.reply('Skipping song');
};
