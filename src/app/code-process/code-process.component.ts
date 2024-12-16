import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CodeProcessService } from '../code-process.service';
import {catchError, forkJoin, Observable, Subscription} from 'rxjs';
import { AsyncPipe, CommonModule, Location } from '@angular/common';
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
  @Input() prevFolder: string = '/fastapi';
  @Input() git_url: string = 'loool';
  folders$: Observable<Folder[]> | null = null;
  selectedFolders = new Map<string, boolean>();
  private subscription: Subscription | null = null;

  constructor(
    private codeProcessService: CodeProcessService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.prevFolder = params['prevFolder'] || '/fastapi';
      this.git_url = params['git_url'] || '/fastapi';


      const storedData = localStorage.getItem('selectedFolders');
      if (storedData) {
        let selectedFolders: Map<string, boolean> = new Map(JSON.parse(storedData));
        this.saveCurrFolders(selectedFolders);

      }

      this.clearLocal()


      if (!this.prevFolder) {
        console.warn('prevFolder is not defined. Please pass a valid value.');
        return;
      }

      this.folders$ = this.codeProcessService.getFiles(this.prevFolder);

      this.subscription = this.folders$.subscribe({
        next: folders => {
          // Initialize selectedFolders with folders that have color === 'green'
          for (const folder of folders) {
            if(folder.color == "green" || folder.color == "blue") {
              this.selectedFolders.set(folder.next, true);
            }
          }
        },
        error: err => {
          console.error('Error fetching folders:', err);
        }
      });
    });
  }

  clearLocal(): void {
    localStorage.removeItem('selectedFolders');
  }

  onFolderSelect(event: Event, folder: Folder): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedFolders.set(folder.next, true);
    }
    // else {
    //   this.selectedFolders = this.selectedFolders.filter(
    //     (selectedFolder) => selectedFolder !== folder
    //   );
    // }
  }

  onFolderUnselect(folder: Folder): void {
    this.selectedFolders.set(folder.next, false);
  }

  checkForFolder(folder: Folder): boolean {
    if (folder.is_folder) {
      return false
    }

    const isSelected = this.selectedFolders.get(folder.next);
    if (typeof isSelected === 'boolean') {
      return isSelected;
    } else {
      return false;
    }
  }

  toggleFolderSelection(event: Event, folder: Folder): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.onFolderSelect(event, folder);
    } else {
      this.onFolderUnselect(folder);
    }
    localStorage.setItem('selectedFolders', JSON.stringify(Array.from(this.selectedFolders.entries())));
    console.log(localStorage.getItem('selectedFolders'))
    console.log(this.selectedFolders);
  }

  ngOnDestroy(): void {}

  navigateToFinish(): void {
    this.saveCurrFolders()
    this.router.navigate(['/finish'], { queryParams: { git_url: this.git_url } });
  }

  getLabel(folder: Folder): string {
    return folder.next.split(this.prevFolder+"/")[1];
  }

  saveCurrFolders(selectedFolders:Map<string, boolean> = this.selectedFolders): void {
    if (selectedFolders.size > 0) {
      const saveObservables = Array.from(selectedFolders.entries()).map(
        ([key, value]) => this.codeProcessService.update_file( key, value )
      );

      forkJoin(saveObservables)
        .pipe(
          catchError((error) => {
            console.error('Error saving folders:', error);
            return [];
          })
        )
        .subscribe({
          complete: () => console.log('Folders saved successfully'),
        });
    }
  }

  selectAllFolders(folders: Folder[]): void {
    this.selectedFolders = new Map(folders.filter(folder=>!folder.is_folder).map(folder => [folder.next, true]));
  }

  getBreadcrumbs(): [string, string][] {
    const breadcrumbs: [string, string][] = [];

    if (!this.prevFolder) {
      console.warn('prevFolder is not defined.');
      return breadcrumbs;
    }

    let acc = "";
    // Split the prevFolder into parts using "/" as the delimiter
    for (const path of this.prevFolder.split('/')) {
      if (path!== '') {
        acc +=  "/" + path
        breadcrumbs.push([path, acc]);
      }
    }

    return breadcrumbs;
  }

  deselectAllFolders(folders: Folder[]): void {
    this.selectedFolders = new Map(folders.filter(folder=>!folder.is_folder).map(folder => [folder.next, false]));
  }

  get_color(folder: Folder):string{
    let color = "white";
    if(this.selectedFolders.has(folder.next)) {
      if (folder.color == "green") {
        if (!this.selectedFolders.get(folder.next)){
          color = "white"
        }else{
          color = folder.color;
        }
      }if(folder.color == "blue") {
        if (!this.selectedFolders.get(folder.next)){
          color = "red"
        }else{
          color = folder.color;
        }
      }if (folder.color == "red") {
        if (this.selectedFolders.get(folder.next)){
          color = "blue"
        }else{
          color = folder.color;
        }
      }if(folder.color == "white"){
        if (this.selectedFolders.get(folder.next)){
          color = "green"
        }else{
          color = folder.color;
        }
      }
    }
    else{
      color = folder.color;
    }

    if (color == "green"){
      color = "#98FB98"
    }if (color == "blue"){
      color = "#6495ED"
    } if (color == "red"){
      color ="#FF0800"
    }

    return color
  }

  get_files_by_type(is_folder: boolean): Folder[] {
    let folders: Folder[] = [];
    if (this.folders$) {
      // Subscribe to the observable to fetch the current folders
      this.folders$.subscribe({
        next: folderList => {
          folders = folderList.filter(folder => folder.is_folder === is_folder);
        },
        error: err => {
          console.error('Error fetching folders:', err);
        }
      });
    }
    return folders;
  }

  navigateBack() {
    this.location.back(); // Go back to the previous route
  }


}
