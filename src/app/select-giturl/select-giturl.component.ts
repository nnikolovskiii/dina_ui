import { Component } from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {CodeProcessService} from '../code-process.service';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule, Location, NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {DocsService} from '../docs.service';
import {ProcessService} from '../process.service';


@Component({
  selector: 'app-select-giturl',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './select-giturl.component.html',
  styleUrl: './select-giturl.component.css'
})

export class SelectGiturlComponent {
  gitUrl: string = '';
  override: boolean = false;
  selectorBs: string = "";
  selectorAttr: string = "";
  selectorType: string = "class";
  loading: boolean = false;
  codeForm: boolean = false;
  patternList: string[] = [""]

  constructor(
    private codeProcessService: CodeProcessService,
    private docsFilesService: DocsService,
    private processService: ProcessService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  async extractLibraries(url: string, override: boolean){
    this.loading = true;
    if (url[url.length - 1] === '/') {
      url = url.substring(0, url.length - 1);
    }
    this.route.queryParams.subscribe(async params => {
      this.selectorBs = params['selectorBs'] || '';
      this.selectorAttr = params['selectorAttr'] || '';
    })
    if (this.codeForm) {
      this.codeProcessService.extract_library(url, override).subscribe()
      console.log("Next")
      this.router.navigate(['/code-process'], { queryParams: { git_url: url } });
    }else{
      let patterns = [];
      for (let pattern of this.patternList) {
        if (pattern != "") {
          patterns.push(pattern.trim());
        }
      }
      console.log(patterns)
      console.log(this.selectorType)

      this.processService.createProcesses(url, "pre").subscribe(
        (response) => {
          this.docsFilesService.extractDocs(url, override, this.selectorBs, this.selectorType, this.selectorAttr, patterns).subscribe();
          this.router.navigate(['/docs-files'], { queryParams: { docs_url: url, prevLink: url } });
        },
      )

    }
  }

  checkLink() {
    if (this.gitUrl && this.gitUrl.includes('.git')) {
      this.codeForm = true;
    } else {
      this.codeForm = false;
    }
  }

  goBack() {
    this.location.back();
  }

  addPattern() {
    this.patternList.push('');
  }
  trackByIndex(index: number, item: string): number {
    return index;
  }
}
