import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.port
    ? `${environment.protocol}://${environment.apiUrl}:${environment.port}/auth/`
    : `${environment.protocol}://${environment.apiUrl}/auth/`;

  constructor(private http: HttpClient) { }

  register(email: string, password: string, full_name: string): Observable<any> {
    return this.http.post(`${this.baseUrl}register`, {email: email, full_name:full_name, password:password});
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}login`, {email: email, password:password}, {
      withCredentials: true,
      responseType: 'json'
    });
  }

  logout(): Observable<any> {
    return this.http.post(
      `${this.baseUrl}logout`,
      {},
      { withCredentials: true }
    );
  }

  getProtectedData(): Observable<any> {
    return this.http.get(`${this.baseUrl}me`, {
      withCredentials: true
    });
  }
}
