import { Subject } from 'rxjs';

interface MusicRequest {
  url: string;
  userId: string;
  guildId: string;
}

interface Target {
  newValue: MusicRequest;
}

class MusicQueue {
  private static instance: MusicQueue;
  private update: Subject<Target>;
  private musicQueue: MusicRequest[];

  private constructor() {
    this.update = new Subject();
    this.musicQueue = [] as MusicRequest[];
  }

  public pushSongToQueue(data: MusicRequest) {
    this.musicQueue.push(data);
    this.update.next({ newValue: data });
  }

  public getMusicQueue() {
    this.musicQueue = this.musicQueue.filter((value) => value);
    return this.musicQueue;
  }

  public getUpdate() {
    return this.update;
  }

  public shiftSong() {
    if (!this.musicQueue.length) {
      return;
    }
    this.musicQueue.shift();
  }

  public static getInstance() {
    return this.instance || (this.instance = new this());
  }
}
export default MusicQueue;
