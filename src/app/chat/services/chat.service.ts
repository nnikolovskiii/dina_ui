import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {Chat, ChatApi, ChatModel} from '../models/chat';
import {environment} from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl = environment.port
    ? `${environment.protocol}://${environment.apiUrl}:${environment.port}/chat/`
    : `${environment.protocol}://${environment.apiUrl}/chat/`;

  constructor(private http: HttpClient) {
  }
  getChats(): Observable<Map<string, Chat[]>> {
    return this.http.get<Map<string, Chat[]>>(`${this.baseUrl}get_chats/`, {
      withCredentials: true
    });
  }


  get_chat_messages(chat_id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}get_chat_messages/${chat_id}`);
  }

  getChatApiAndModels(type: string): Observable<{ models: ChatModel[]; api: ChatApi }> {
    const url = `${this.baseUrl}get_chat_api_and_models/`; // Adjust the endpoint as needed
    return this.http
      .get<{ models: ChatModel[]; api: ChatApi }>(url, {params: {type}})
      .pipe(
        catchError(this.handleError)
      );
  }

  addChatModel(name: string, chatApiType: string): Observable<any> {
    return this.http.post(`${this.baseUrl}add_chat_model/`, {"name": name, "chat_api_type": chatApiType}, {});
  }

  setActiveChatModel(model: string, type: string): Observable<any> {
    return this.http.post(`${this.baseUrl}set_active_model/`, {"model": model, "type": type}, {});
  }

  getActiveChatModel(): Observable<ChatModel> {
    return this.http.get<ChatModel>(`${this.baseUrl}get_active_model/`);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Failed to fetch real-chat API and models. Please try again later.'));
  }
}
