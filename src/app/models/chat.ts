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
  chat_api_type: string;

  constructor(name: string, chat_api_type: string) {
    this.name = name;
    this.chat_api_type = chat_api_type;
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
