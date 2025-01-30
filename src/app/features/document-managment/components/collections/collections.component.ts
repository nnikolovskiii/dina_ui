import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule, Location} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DocsService} from '../../services/docs/docs.service';
import {Url} from '../../models/url';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.css'
})
export class CollectionsComponent {
  displayedUrls: Url[] | undefined;
  loading: boolean = true;

  constructor(
    private docsService: DocsService,
    private route: ActivatedRoute,
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
    } else {
      url.loaded = false;

      // Delay the API call by 3 seconds
      setTimeout(() => {
        this.docsService.activateDocsUrl(url.url, url.active).subscribe(
          (response) => {
            url.loaded = true;
          },
          (error) => {
            console.error('Error activating/deactivating URL:', error);
            url.loaded = true;
          }
        );
      }, 1000);
    }
  }


  selectedStatus = 'docs';

  changeDisplayUrls(status: string) {
    this.displayedUrls = []
    this.selectedStatus = status;
    if (status === 'code') {
    } else if (status === 'docs') {
      this.setToDocs();
    }
  }

  setToDocs() {
    this.docsService.getDocsUrls().subscribe(
      (urls: Url[]) => {
        this.displayedUrls = urls;
        console.log(this.displayedUrls);
        this.loading = false;
      },
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
