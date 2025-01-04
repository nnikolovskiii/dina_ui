import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {Chat, ChatApi, ChatModel} from './models/chat';


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

  getChatApiAndModels(type: string): Observable<{ models: ChatModel[]; api: ChatApi }> {
    const url = `${this.baseUrl}get_chat_api_and_models/`; // Adjust the endpoint as needed
    return this.http
      .get<{ models: ChatModel[]; api: ChatApi }>(url, { params: { type } })
      .pipe(
        catchError(this.handleError)
      );
  }

  addChatModel(name: string, chatApiType: string): Observable<any>{
    return this.http.post(`${this.baseUrl}add_chat_model/`, { "name":name, "chat_api_type":chatApiType }, {});
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Failed to fetch chat API and models. Please try again later.'));
  }
}
