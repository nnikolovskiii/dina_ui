import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {CodeProcessService} from '../code-process.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {firstValueFrom} from 'rxjs';
import {DocsService} from '../docs.service';
@Component({
  selector: 'app-finish',
  standalone: true,
  imports: [],
  templateUrl: './finish.component.html',
  styleUrl: './finish.component.css'
})
export class FinishComponent implements OnInit, OnDestroy{
  @Input() url: string = '';
  @Input() type: string = '';
  constructor(
    private codeProcessService: CodeProcessService,
    private docsFilesService: DocsService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      this.url = params['url'] || 'https://github.com/fastapi/fastapi.git';
      this.type = params['type'] || '';
      console.log(this.url, this.type)
    });
  }

  async completeFinish(){
    if (this.type==="code") {
      this.codeProcessService.activate_tmp_files(this.url).subscribe()
    } else if (this.type === "docs"){
      // this.docsFilesService.activateTmpFiles(this.url).subscribe()
    }

    this.router.navigate(['/process'],);
  }


  navigateBack() {
    this.location.back();
  }


  ngOnDestroy() {
  }
}
