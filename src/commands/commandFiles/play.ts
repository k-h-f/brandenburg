import { joinVoiceChannel } from '@discordjs/voice';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import ytdl from 'ytdl-core';
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

  const ytRegexExp = new RegExp(
    `(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))`
  );

  if (!ytRegexExp.test(url)) {
    interaction.reply('Invalid YouTube URL');
    return;
  }

  if (!interaction.member || !interaction.guildId) {
    await interaction.reply('Something went wrong... Errorcode: 1');
    return;
  }

  const channelId = interaction.guild?.members.cache.get(
    interaction.member.user.id
  )?.voice.channelId;

  if (!channelId) {
    await interaction.reply('Please join a voice channel');
    return;
  }

  joinVoiceChannel({
    channelId: channelId,
    guildId: interaction.guild.id,
    adapterCreator: interaction.guild.voiceAdapterCreator,
    selfDeaf: false
  });

  const stream = ytdl(url, {
    filter: 'audioonly'
  });

  MusicQueue.getInstance().pushSongToQueue({
    url,
    userId: interaction.member.user.id,
    guildId: interaction.guildId,
    stream
  });

  interaction.reply(`Added ${url} to the queue`);
};
