export class Chat {
  id: string;
  title: string;
  timestamp: Date;

  constructor(id: string, title: string, timestamp: Date) {
    this.id = id;
    this.title = title;
    this.timestamp = timestamp;
  }
}
