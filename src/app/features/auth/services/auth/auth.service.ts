import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

interface UserInfo {
  email?: string;
  id?: string;
  name?: string;
  surname?: string;
  e_id: string;
  father_name: string;
  mother_name: string;
  date_of_birth: Date;
  gender: GenderEnum; // Changed from string to Gender enum
  living_address: string;
  passport_number: string;
  id_card_number: string;
}

export type { UserInfo };

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

  addUserInfo(userInfo: UserInfo): Observable<any> {
    return this.http.post(`${this.baseUrl}add-user-info`, userInfo, {
      withCredentials: true
    });
  }

  getUserInfo(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}get-user-info?email=${email}`, {
      withCredentials: true
    });
  }

  hasUserInfo(): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}has-user-info`, {
      withCredentials: true
    });
  }
}
