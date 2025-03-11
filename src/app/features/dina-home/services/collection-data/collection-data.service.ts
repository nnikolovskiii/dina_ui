import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';

interface CollectionDataResponse {
  appointments: any[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CollectionDataService {
  private baseUrl = environment.port
    ? `${environment.protocol}://${environment.apiUrl}:${environment.port}/collection_data/`
    : `${environment.protocol}://${environment.apiUrl}/collection_data/`;

  constructor(private http: HttpClient) { }

  getCollectionData(collectionName: string, page: number = 1): Observable<CollectionDataResponse> {
    const url = `${this.baseUrl}get_collection_data_page/${page}`;
    return this.http.post<any[]>(url, { collection_name: collectionName }, { withCredentials: true })
      .pipe(
        // Map the array response to the CollectionDataResponse structure
        map((response: any[]) => ({
          appointments: response[0],
          total: response[1]
        })),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
