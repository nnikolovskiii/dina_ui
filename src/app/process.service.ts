import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Link} from './models/link';
import {DocsUrl} from './models/docs-url';
import {Process} from './models/process';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {
  private baseUrl = 'http://localhost:5000/process';

  constructor(private http: HttpClient) {}

  getProcesses(): Observable<Map<string, Process[]>> {
    return this.http.get<any>(`${this.baseUrl}/get_processes`).pipe(
      map(response => {
        const processMap = new Map<string, Process[]>();

        // Assuming response has the four keys:
        const { code_processes_ongoing, docs_processes_ongoing, code_processes_finished, docs_processes_finished } = response;

        // Function to add processes to the map
        const addProcessesToMap = (processList: any[], key: string) => {
          let li: Process[] = []
          processList.forEach(processData => {
            const process = new Process(
              processData.finished,
              processData.end,
              processData.curr,
              processData.process_type,
              processData.url,
              processData.type
            );
            li.push(process);
          });
          processMap.set(key, li);
        };

        // Add all processes to the map
        addProcessesToMap(code_processes_ongoing, "code_ongoing");
        addProcessesToMap(docs_processes_ongoing, "docs_ongoing");
        addProcessesToMap(code_processes_finished, "code_finished");
        addProcessesToMap(docs_processes_finished, "docs_finished");

        return processMap;
      })
    );
  }

}
