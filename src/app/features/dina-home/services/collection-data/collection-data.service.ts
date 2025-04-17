import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {environment} from '../../../../../environments/environment';

interface CollectionDataResponse {
  items: any[];
  total: number;
}

interface OperationResponse {
  status: string;
  message: string;
  object_id: string;
  collection: string;
}

@Injectable({
  providedIn: 'root'
})
export class CollectionDataService {
  private baseUrl = environment.port
    ? `${environment.protocol}://${environment.apiUrl}:${environment.port}/collection_data/`
    : `${environment.protocol}://${environment.apiUrl}/collection_data/`;

  constructor(private http: HttpClient) {
  }

  getCollectionData(collectionName: string, page: number = 1): Observable<CollectionDataResponse> {
    const url = `${this.baseUrl}get_collection_data_page/${page}`;
    return this.http.post<CollectionDataResponse>(
      url,
      {name: collectionName},
      {withCredentials: true}
    ).pipe(
      catchError(this.handleError)
    );
  }

  updateEntry(collectionName: string, objId: string, attributes: any): Observable<OperationResponse> {
    const url = `${this.baseUrl}update_entry/${objId}`;
    return this.http.post<OperationResponse>(
      url,
      {name: collectionName, attributes: attributes},
      {withCredentials: true}
    ).pipe(
      catchError(this.handleError)
    );
  }

  deleteEntry(collectionName: string, objId: string): Observable<OperationResponse> {
    const url = `${this.baseUrl}delete_entry/${objId}`;
    return this.http.delete<OperationResponse>(
      url,
      {
        body: {name: collectionName},
        withCredentials: true
      }
    ).pipe(
      catchError(this.handleError)
    );
  }

  addEntry(collectionName: string, attributes: any): Observable<OperationResponse> {
    const url = `${this.baseUrl}add_entry/`;
    return this.http.post<OperationResponse>(
      url,
      {name: collectionName, attributes: attributes},
      {withCredentials: true}
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
