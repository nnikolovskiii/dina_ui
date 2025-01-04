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

export class ChatModel {
  name: string;
  chatApiType: string;

  constructor(name: string, chatApiType: string) {
    this.name = name;
    this.chatApiType = chatApiType;
  }
}

export class ChatApi {
  type: string;
  apiKey: string;

  constructor(type: string, apiKey: string) {
    this.type = type;
    this.apiKey = apiKey;
  }
}
