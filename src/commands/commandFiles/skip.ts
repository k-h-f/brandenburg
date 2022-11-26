import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { player } from '../../app';
import MusicQueue from '../../musicQueue';

export const data = new SlashCommandBuilder()
  .setName('skip')
  .setDescription('Skips the current song being played');

export const execute = async (interaction: ChatInputCommandInteraction) => {
  player.getPlayer().stop();
  MusicQueue.getInstance().shiftSong();

  interaction.reply('Skipping song');
};
