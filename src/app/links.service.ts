import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { environment } from '../environments/environment';
import {Link} from './models/link';

@Injectable({
  providedIn: 'root',
})
export class LinksService {
  private baseUrl = 'http://' + environment.apiUrl + ':' + environment.port + '/links';

  constructor(private http: HttpClient) {}

  /**
   * Fetches links from the parent link.
   * @param prevLink The previous link to fetch child links from.
   * @returns Observable containing a list of `Link` objects.
   */
  getLinksFromParent(prevLink: string): Observable<Link[]> {
    const params = new HttpParams().set('prev_link', prevLink);
    return this.http.get<{ links: any[] }>(`${this.baseUrl}/get_links_from_parent/`, { params }).pipe(
      map((response) => response.links.map((link) => this.mapToLink(link)))
    );
  }

  /**
   * Processes links for a given document URL.
   * @param docsUrl The document URL to process.
   * @returns Observable with no return value (backend does not return data).
   */
  processLinks(docsUrl: string): Observable<void> {
    const params = new HttpParams().set('docs_url', docsUrl);
    return this.http.get<void>(`${this.baseUrl}/process_links/`, { params });
  }

  /**
   * Activates or deactivates a specific link.
   * @param link The link to activate or deactivate.
   * @param activeStatus The new active status.
   * @returns Observable with no return value (backend does not return data).
   */
  activateLink(link: string, activeStatus: boolean): Observable<void> {
    const params = new HttpParams()
      .set('link', link)
      .set('active_status', activeStatus.toString());
    return this.http.get<void>(`${this.baseUrl}/activate_link/`, { params });
  }

  /**
   * Activates or deactivates all links from a parent link recursively.
   * @param prevLink The parent link to update child links.
   * @param activeStatus The new active status.
   * @returns Observable with no return value (backend does not return data).
   */
  activateAllLinksFromParent(prevLink: string, activeStatus: boolean): Observable<void> {
    const params = new HttpParams()
      .set('prev_link', prevLink)
      .set('active_status', activeStatus.toString());
    return this.http.get<void>(`${this.baseUrl}/activate_all_links_from_parent/`, { params });
  }

  /**
   * Activates or deactivates all links for a given document URL.
   * @param docsUrl The base document URL to update links.
   * @param activeStatus The new active status.
   * @returns Observable with no return value (backend does not return data).
   */
  activateAllLinksFromDocsUrl(docsUrl: string, activeStatus: boolean): Observable<void> {
    const params = new HttpParams()
      .set('docs_url', docsUrl)
      .set('active_status', activeStatus.toString());
    return this.http.get<void>(`${this.baseUrl}/activate_all_links_from_docs_url/`, { params });
  }

  /**
   * Maps a raw object to a `Link` instance.
   * @param raw The raw object returned by the backend.
   * @returns A `Link` instance.
   */
  private mapToLink(raw: any): Link {
    return new Link(
      raw.id,
      raw.prev_link,
      raw.link,
      raw.base_url,
      raw.color,
      raw.is_parent,
      raw.active
    );
  }
}
