import { Subject } from 'rxjs';

interface MusicRequest {
  url: string;
  userId: string;
}

class MusicQueue {
  private static instance: MusicQueue;
  private update;
  private musicQueue: MusicRequest[];

  private constructor() {
    this.update = new Subject();
    this.musicQueue = new Proxy([], {
      set: (obj: MusicRequest[], prop: any, newval) => {
        obj[prop] = newval;

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

  public static getInstance() {
    return this.instance || (this.instance = new this());
  }
}
export default MusicQueue;
