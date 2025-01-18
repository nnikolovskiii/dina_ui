import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { environment } from '../environments/environment';
import {DocsUrl} from './models/docs-url';
import {Url} from './models/url';

@Injectable({
  providedIn: 'root',
})
export class DocsService {
  private baseUrl = 'http://' + environment.apiUrl + ':' + environment.port + '/docs';

  constructor(private http: HttpClient) {}

  getDocsUrls(): Observable<Url[]> {
    return this.http.get<{ docs_urls: any[] }>(`${this.baseUrl}/get_docs_urls/`).pipe(
      map((response) =>
        response.docs_urls.map(
          (entry) => new Url(entry.id, entry.url, entry.active)
        )
      )
    );
  }

  activateDocsUrl(docsUrl: string, activeStatus: boolean): Observable<any> {
    const params = new HttpParams()
      .set('docs_url', docsUrl)
      .set('active_status', activeStatus.toString());
    return this.http.get(`${this.baseUrl}/activate_docs_url/`, { params });
  }

  extractDocs(
    docsUrl: string,
    override: boolean,
    selector: string,
    selectorType: string,
    selectorAttrs: string,
    patternList: string[]
  ): Observable<any> {
    const params = new HttpParams()
      .set('docs_url', docsUrl)
      .set('override', override.toString())
      .set('selector', selector)
      .set('selector_type', selectorType)
      .set('selector_attrs', selectorAttrs);

    return this.http.post(
      `${this.baseUrl}/extract_docs/`,
      { patterns: patternList },
      { params }
    );
  }
}
