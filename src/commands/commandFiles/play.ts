import {
  ChatInputCommandInteraction,
  InternalDiscordGatewayAdapterCreator,
  SelectMenuOptionBuilder,
  SlashCommandBuilder
} from 'discord.js';
import { joinVoiceChannel } from '@discordjs/voice';
import MusicQueue from '../../musicQueue';

export const data = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Plays song from URL')
  .addStringOption((option) =>
    option
      .setName('url')
      .setDescription('url of the song to play')
      .setRequired(true)
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const url = interaction.options.data[0].value as string;

  if (!interaction.member) {
    await interaction.reply('Something went wrong... Errorcode: 1');
    return;
  }

  //Check if already playing, if we're already playing, then do nothing
  MusicQueue.getInstance().pushSongToQueue({
    url,
    userId: interaction.member.user.id
  });
  interaction.reply('Added song');

  // const channelId = interaction.guild?.members.cache.get(
  //   interaction.member.user.id
  // )?.voice.channelId;

  // if (!channelId) {
  //   await interaction.reply('Please join a voice channel');
  //   return;
  // }

  // joinVoiceChannel({
  //   channelId: channelId,
  //   guildId: interaction.guild.id,
  //   adapterCreator: interaction.guild.voiceAdapterCreator,
  //   selfDeaf: false
  // });

  // await interaction.reply('Finished');

  //If not playing, connect to VC and start playing, once song finishes, pop the song from queue
};
