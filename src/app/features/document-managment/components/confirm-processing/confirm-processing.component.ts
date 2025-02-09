import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location, NgForOf, NgIf} from '@angular/common';
import {DocsLinksService} from '../../services/docs-links/docs-links.service';
import {BlobComponent} from '../../../../global-features/components/blob/blob.component';
@Component({
  selector: 'app-confirm-processing',
  standalone: true,
  imports: [
    BlobComponent
  ],
  templateUrl: './confirm-processing.component.html',
  styleUrl: './confirm-processing.component.css'
})
export class ConfirmProcessingComponent implements OnInit, OnDestroy{
  @Input() url: string = '';
  @Input() type: string = '';
  constructor(
    private linkService: DocsLinksService,
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
    } else if (this.type === "docs"){
      this.linkService.processLinks(this.url).subscribe()
    }

    this.router.navigate(['/process'],);
  }


  navigateBack() {
    this.location.back();
  }


  ngOnDestroy() {
  }
}
