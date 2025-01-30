import { Injectable } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocsContentService {
  private baseUrl = environment.port
    ? `${environment.protocol}://${environment.apiUrl}:${environment.port}/collection-data`
    : `${environment.protocol}://${environment.apiUrl}/collection-data`;
  constructor(private http: HttpClient) {}

  getAllContentData(base_url: string,): Observable<any> {
    const params = { base_url: base_url};
    return this.http.get(`${this.baseUrl}/get_all_content_data/`,  { params });
  }

  getContentDataByLink(base_url: string, link: string): Observable<any> {
    const params = { base_url: base_url , link: link};
    return this.http.get(`${this.baseUrl}/get_content_data_by_link/`,  { params });
  }
}
