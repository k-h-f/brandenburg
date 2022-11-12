import { Subject } from 'rxjs';

interface MusicRequest {
  url: string;
  userId: string;
  guildId: string;
}

interface Target {
  musicRequestArr: MusicRequest[];
  key: any;
  newValue: MusicRequest;
}

class MusicQueue {
  private static instance: MusicQueue;
  private update: Subject<Target>;
  private musicQueue: MusicRequest[];

  private constructor() {
    this.update = new Subject();
    this.musicQueue = new Proxy([], {
      set: (
        musicRequestArr: MusicRequest[],
        key: any,
        newValue: MusicRequest
      ) => {
        musicRequestArr[key] = newValue;
        this.update.next({ musicRequestArr, key, newValue });
        return true;
      }
    });
  }

  public pushSongToQueue(data: MusicRequest) {
    this.musicQueue.push(data);
  }

  public getMusicQueue() {
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
