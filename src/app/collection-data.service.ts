import { Injectable } from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Link} from './models/link';
import {Url} from './models/url';

@Injectable({
  providedIn: 'root'
})
export class CollectionDataService {
  private baseUrl = 'http://'+environment.apiUrl+':' +environment.port+ '/collection-data';

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
