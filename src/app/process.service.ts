import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Link} from './models/link';
import {DocsUrl} from './models/docs-url';
import {Process} from './models/process';
import {Folder} from './models/folder';
import {SimpleProcess} from './models/simple-process';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {
  private baseUrl = environment.port
    ? `${environment.protocol}://${environment.apiUrl}:${environment.port}/process`
    : `${environment.protocol}://${environment.apiUrl}/process`;
  constructor(private http: HttpClient) {}

  getFinishedProcesses(): Observable<Process[]> {
    return this.http.get<any>(`${this.baseUrl}/get_finished_processes/`).pipe(
      map((response) =>
        response.processes.map((process: any) => ({
          id: process.id,
          finished: process.finished,
          end: process.end,
          curr: process.curr,
          process_type: process.process_type,
          url: process.url,
          type: process.type,
        }))
      )
    );
  }

  getOngoingProcesses(): Observable<Process[]> {
    return this.http.get<any>(`${this.baseUrl}/get_ongoing_processes/`).pipe(
      map((response) =>
        response.processes.map((process: any) => ({
          id: process.id,
          finished: process.finished,
          end: process.end,
          curr: process.curr,
          process_type: process.process_type,
          url: process.url,
          type: process.type,
        }))
      )
    );
  }

  refreshProgress(process_id: string): Observable<any> {
    const params = { process_id: process_id };
    return this.http.get(`${this.baseUrl}/refresh_progress/`,  { params });
  }

  getPreProcesses(url: string): Observable<Map<string, [boolean, number]>> {
    const params = { url: url };
    return this.http.get<Record<string, [boolean, number]>>(`${this.baseUrl}/get_pre_processes/`, { params }).pipe(
      map(response => new Map(Object.entries(response)))
    );
  }

  getPreProcess(url: string, processType: string): Observable<SimpleProcess> {
    const params = { url: url , process_type: processType};
    return this.http.get<SimpleProcess>(`${this.baseUrl}/get_pre_process/`, { params })
  }

  deletePreProcesses(url: string): Observable<boolean> {
    const params = { url };
    return this.http.delete<boolean>(`${this.baseUrl}/delete_pre_process/`, { params });
  }
}
