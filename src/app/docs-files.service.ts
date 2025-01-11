import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Link} from './models/link';
import {DocsUrl} from './models/docs-url';
import {GitUrl} from './models/git-url';
import {Url} from './models/url';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocsFilesService {
  private baseUrl = 'http://'+environment.apiUrl+':' +environment.port+ '/docs_files';

  constructor(private http: HttpClient) {}

  getLinks(prevLink: string): Observable<Link[]> {
    return this.http.get<any>(`${this.baseUrl}/get_links?prev_link=${prevLink}`).pipe(
      map((response) =>
        response.links.map((link: any) => ({
          id: link.id,
          prev_link: link.prev_link,
          link: link.link,
          base_url: link.base_url,
          color: link.color,
          is_parent: link.is_parent
        }))
      )
    );
  }

  updateLink(link: string, active: boolean): Observable<any> {
    return this.http.post(`${this.baseUrl}/update_link/`, { "link":link, "active":active }, {});
  }

  activateTmpFiles(docs_url: string): Observable<any> {
    const params = { docs_url: docs_url };
    return this.http.get(`${this.baseUrl}/activate_tmp_files/`,  { params });
  }

  getDocsUrls(): Observable<Url[]> {
    return this.http.get<any>(`${this.baseUrl}/get_docs_urls/`).pipe(
      map((response) =>
        response.docs_urls.map((docs_url: any) => ({
          id: docs_url.id,
          url: docs_url.url,
          active: docs_url.active
        }))
      )
    );
  }

  selectAllLinks(prev_link: string, select: boolean): Observable<any> {
    const params = { prev_link: prev_link , select: select};
    return this.http.get(`${this.baseUrl}/select_all_links/`,  { params });
  }

  selectDocs(docs_url: string, select: boolean): Observable<any> {
    const params = { docs_url: docs_url , select: select};
    return this.http.get(`${this.baseUrl}/select_docs/`,  { params });
  }


  extractDocs(
    docs_url: string,
    override: boolean,
    selector: string,
    selectorType: string,
    selectorAttrs: string,
    patternList: string[]
  ): Observable<any> {
    const params = { docs_url: docs_url, override: override, selector: selector, selector_type: selectorType, selector_attrs: selectorAttrs };
    return this.http.post(
      `http://localhost:5000/docs/extract_docs/`,
      { patterns: patternList },
      { params: params }
    );  }

  changeActiveRepos(docsUrls: string[], active: boolean[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/change_active_repos/`, {"docs_urls": docsUrls, "active": active}, {});
  }
}
