import {Component, Input} from '@angular/core';
import {CodeProcessService} from '../code-process.service';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule, Location} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DocsService} from '../docs.service';
import {Url} from '../models/url';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.css'
})
export class CollectionsComponent {
  displayedUrls: Url[] | undefined;

  constructor(
    private codeProcessService: CodeProcessService,
    private docsService: DocsService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
        this.setToDocs()
    });
  }

  getLabel(title: string) {
    return title.split('https://')[1]
  }

  toggleUrlActive(url: Url): void {
    url.active = !url.active;
    if (this.selectedStatus === 'code') {
      this.codeProcessService.change_active_repos([url.url], [url.active]).subscribe()
    }else{
      url.loaded = false
      this.docsService.activateDocsUrl(url.url, url.active).subscribe(
        (response) => {
          url.loaded = true
        }
      )
    }
  }


  selectedStatus = 'docs';

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
    this.docsService.getDocsUrls().subscribe(
      (urls: Url[]) => {
        this.displayedUrls = urls;
        console.log(this.displayedUrls);

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
