import {Component, Input} from '@angular/core';
import {CodeProcessService} from '../code-process.service';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule, Location} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DocsFilesService} from '../docs-files.service';
import {Url} from '../models/url';

@Component({
  selector: 'app-list-giturl',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list-giturl.component.html',
  styleUrl: './list-giturl.component.css'
})
export class ListGiturlComponent {
  displayedUrls: Url[] | undefined;

  constructor(
    private codeProcessService: CodeProcessService,
    private docsFilesService: DocsFilesService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
        this.setToCode()
    });
  }

  selectedStatus = 'code';

  changeDisplayUrls(status: string) {
    this.displayedUrls = []
    this.selectedStatus = status;
    if (status === 'code') {
      this.setToCode();
    } else if (status === 'docs') {
      this.setToDocs();
    }
  }

  setToDocs() {
    this.docsFilesService.getDocsUrls().subscribe(
      (urls: Url[]) => {
        this.displayedUrls = urls;
      },
      (error) => {
        console.error('Error fetching processes:', error);
        // Handle error appropriately, e.g., show error message to user
      }
    );
  }

  setToCode() {
    this.codeProcessService.get_git_urls().subscribe(
      (urls: Url[]) => {
        this.displayedUrls = urls;
      },
      (error) => {
        console.error('Error fetching processes:', error);
      }
    );
  }

  refresh(){

  }

  getCodeFolder(url:string):string{
    let tmp = url.split('.git')[0]
    let li = tmp.split("/")
    return "/"+li[li.length-1]
  }
}
