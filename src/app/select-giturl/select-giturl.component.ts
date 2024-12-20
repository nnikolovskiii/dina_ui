import { Component } from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {CodeProcessService} from '../code-process.service';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule, Location, NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {DocsFilesService} from '../docs-files.service';


@Component({
  selector: 'app-select-giturl',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgOptimizedImage],
  templateUrl: './select-giturl.component.html',
  styleUrl: './select-giturl.component.css'
})

export class SelectGiturlComponent {
  gitUrl: string = '';
  override: boolean = false;
  selectorBs: string = "";
  selectorAttr: string = "";
  loading: boolean = false;
  codeForm: boolean = false;

  constructor(
    private codeProcessService: CodeProcessService,
    private docsFilesService: DocsFilesService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  async extractLibraries(url: string, override: boolean){
    this.loading = true;
    if (this.codeForm) {
      await firstValueFrom(this.codeProcessService.extract_library(url, override));
      this.router.navigate(['/code-process'], { queryParams: { git_url: url } });
    }else{
      await firstValueFrom(this.docsFilesService.extractDocs(url, override, this.selectorBs, this.selectorAttr));
      this.router.navigate(['/docs-files'], { queryParams: { docs_url: url } });
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
}
