import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection
} from '@discordjs/voice';
import internal from 'stream';
import ytdl from 'ytdl-core';
import MusicQueue from './musicQueue';

class Player {
  private player;

  constructor() {
    this.player = createAudioPlayer();
  }

  subscribeToMusicQueue() {
    //Listen to any changes to the music queue (push changes)
    MusicQueue.getInstance()
      .getUpdate()
      .subscribe((data) => {
        const connection = getVoiceConnection(data.newValue.guildId);

        if (!connection) {
          return;
        }

        connection.subscribe(this.player);

        if (!MusicQueue.getInstance().getMusicQueue().length) {
          return;
        }

        this.audioHandler(this.player.state.status);
      });

    //Add this listener so that if the bot is already playing, we wait
    //for it to finish to continue playing a song
    this.player.addListener('stateChange', (_oldState, newState) => {
      console.log('test');
      this.audioHandler(newState.status);
      if (newState.status === AudioPlayerStatus.Idle) {
        MusicQueue.getInstance().shiftSong();
      }
    });
  }

  public audioHandler(state: AudioPlayerStatus) {
    if (!MusicQueue.getInstance().getMusicQueue().length) {
      return;
    }

    if (state == AudioPlayerStatus.Idle) {
      const resource = createAudioResource(
        MusicQueue.getInstance().getMusicQueue()[0].stream
      );

      console.log('player', MusicQueue.getInstance().getMusicQueue()[0].url);

      this.player.play(resource);
    }
  }
}

export default Player;
