import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { environment } from '../environments/environment';
import { Process } from './models/process';

@Injectable({
  providedIn: 'root',
})
export class ProcessService {
  private baseUrl = environment.port
    ? `${environment.protocol}://${environment.apiUrl}:${environment.port}/process`
    : `${environment.protocol}://${environment.apiUrl}/process`;

  constructor(private http: HttpClient) {}

  getFinishedProcesses(group: string): Observable<Process[]> {
    const url = `${this.baseUrl}/get_finished_processes/`;
    return this.http.get<{ processes: Process[] }>(url, { params: { group } }).pipe(
      map((response) => response.processes)
    );
  }

  getOngoingProcesses(group: string): Observable<Process[]> {
    const url = `${this.baseUrl}/get_ongoing_processes/`;
    return this.http.get<{ processes: Process[] }>(url, { params: { group } }).pipe(
      map((response) => response.processes)
    );
  }

  refreshProgress(processId: string): Observable<Process> {
    const url = `${this.baseUrl}/refresh_progress/`;
    return this.http.get<Process>(url, { params: { process_id: processId } });
  }

  getProcessesFromUrl(url: string, group: string): Observable<Map<string, [boolean, number]>> {
    const endpoint = `${this.baseUrl}/get_processes_from_url/`;
    return this.http.get<Record<string, [boolean, number]>>(endpoint, { params: { url, group } }).pipe(
      map((response) => {
        const resultMap = new Map<string, [boolean, number]>();
        Object.entries(response).forEach(([key, value]) => {
          resultMap.set(key, value);
        });
        return resultMap;
      })
    );
  }


  getProcess(url: string, processType: string, group: string): Observable<Process> {
    const endpoint = `${this.baseUrl}/get_process/`;
    return this.http.get<Process>(endpoint, {
      params: { url, process_type: processType, group },
    });
  }

  createProcesses(url: string, group: string): Observable<boolean> {
    const endpoint = `${this.baseUrl}/create_processes/`;
    return this.http.delete<boolean>(endpoint, {
      params: { url, group },
    });
  }
}
