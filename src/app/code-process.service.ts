import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Folder} from './models/folder';

interface GitUrlDto {
  git_urls: string[];
  active: boolean[];
}

interface FileActiveDto {
  file_paths: string[];
  active: boolean[];
}

interface FileDto {
  file_paths: string[];
}

@Injectable({
  providedIn: 'root',
})
export class CodeProcessService {
  private baseUrl = 'http://localhost:5000/code_files';

  constructor(private http: HttpClient) {}

  extractLibrary(gitUrl: string, override: boolean): Observable<any> {
    const params = { git_url: gitUrl, override: override };
    return this.http.get(`${this.baseUrl}/extract_library/`, { params });
  }

  changeActiveRepos(gitUrlDto: GitUrlDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/change_active_repos`, gitUrlDto);
  }

  changeActiveFiles(fileActiveDto: FileActiveDto, gitUrl: string): Observable<any> {
    const params = { git_url: gitUrl };
    return this.http.post(`${this.baseUrl}/change_active_files/`, fileActiveDto, { params });
  }

  chunkAllCode(gitUrl: string): Observable<any> {
    const params = { git_url: gitUrl };
    return this.http.get(`${this.baseUrl}/chunk_all_code/`, { params });
  }

  processFiles(fileDto: FileDto, gitUrl: string): Observable<any> {
    const params = { git_url: gitUrl };
    return this.http.post(`${this.baseUrl}/process_files/`, fileDto, { params });
  }

  getFiles(prevFolder: string): Observable<Folder[]> {
    return this.http.get<any>(`${this.baseUrl}/get_files?prev_folder=${prevFolder}`).pipe(
      map((response) =>
        response.folders.map((folder: any) => ({
          id: folder.id,
          prev: folder.prev,
          next: folder.next,
          is_folder: folder.is_folder,
          url: folder.url,
          color: folder.color
        }))
      )
    );
  }

  update_file(file_path: string, active: boolean): Observable<any> {
    return this.http.post(`${this.baseUrl}/update_file/`, { "file_path":file_path, "active":active }, {});
  }
}
