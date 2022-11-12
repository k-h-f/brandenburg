import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection
} from '@discordjs/voice';
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

        this.playMusicQueue(this.player.state.status);
      });

    //Add this listener so that if the bot is already playing, we wait
    //for it to finish to continue playing a song
    this.player.addListener('stateChange', (_oldState, newState) => {
      this.playMusicQueue(newState.status);
    });
  }

  public playMusicQueue(state: AudioPlayerStatus) {
    if (!MusicQueue.getInstance().getMusicQueue().length) {
      return;
    }

    if (state == AudioPlayerStatus.Idle) {
      const stream = ytdl(MusicQueue.getInstance().getMusicQueue()[0].url, {
        filter: 'audioonly'
      });
      MusicQueue.getInstance().shiftSong();

      const resource = createAudioResource(stream);

      this.player.play(resource);
    }
  }
}

export default Player;
