import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Chat} from './models/chat';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl = 'http://localhost:5000/chat/';

  constructor(private http: HttpClient) {}

  getChats(): Observable<Chat[]> {
    return this.http.get<any>(`${this.baseUrl}get_chats/`).pipe(
      map((response) =>
        response.map((chat: any) => ({
          id: chat.id,
          title: chat.title,
          timestamp: chat.timestamp,
        }))
      )
    );
  }

  add_chat(user_messages: string[], assistant_messages: string[]): Observable<any> {
    return this.http.post(`${this.baseUrl}add_chat/`, { "user_messages":user_messages, "assistant_messages":assistant_messages }, {});
  }

  update_chat(chat_id: string, user_messages: string[], assistant_messages: string[]): Observable<any> {
    return this.http.post(`${this.baseUrl}update_chat/${chat_id}`, { "user_messages":user_messages, "assistant_messages":assistant_messages }, {});
  }

  get_chat_messages(chat_id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}get_chat_messages/${chat_id}`);
  }
}
