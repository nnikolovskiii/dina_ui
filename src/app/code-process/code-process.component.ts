import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CodeProcessService } from '../code-process.service';
import { catchError, forkJoin, Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Folder } from '../models/folder';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-code-process',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './code-process.component.html',
  styleUrls: ['./code-process.component.css'],
})
export class CodeProcessComponent implements OnInit, OnDestroy {
  @Input() prevFolder: string = '/fastapi'; // Accept prevFolder as an Input
  folders$: Observable<Folder[]> | null = null;
  selectedFolders: Folder[] = [];

  constructor(private codeProcessService: CodeProcessService, private router: Router,  private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.prevFolder = params['prevFolder'] || '/fastapi';
      if (!this.prevFolder) {
        console.warn('prevFolder is not defined. Please pass a valid value.');
        return;
      }
      this.folders$ = this.codeProcessService.getFiles(this.prevFolder);
    });
  }
  onFolderSelect(event: Event, folder: Folder): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedFolders.push(folder);
    } else {
      this.selectedFolders = this.selectedFolders.filter(
        (selectedFolder) => selectedFolder !== folder
      );
    }
  }

  onFolderUnselect(folder: Folder): void {
    this.selectedFolders = this.selectedFolders.filter(
      (selectedFolder) => selectedFolder !== folder
    );
  }

  toggleFolderSelection(event: Event, folder: Folder): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.onFolderSelect(event, folder);
    } else {
      this.onFolderUnselect(folder);
    }
  }

  ngOnDestroy(): void {}

  navigateToQuestions(): void {
    if (this.selectedFolders.length > 0) {
      const saveObservables = this.selectedFolders.map(folder =>
        this.codeProcessService.addFile(folder)
      );

      forkJoin(saveObservables).pipe(
        catchError(error => {
          console.error('Error saving folders:', error);
          return [];
        })
      ).subscribe(() => {
        this.router.navigate(['/questions']);
      });
    } else {
      this.router.navigate(['/questions']);
    }
  }

  selectAllFolders(folders: Folder[]): void {
    this.selectedFolders = [...folders];
  }

  deselectAllFolders(): void {
    this.selectedFolders = [];
  }
}
