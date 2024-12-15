import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {CodeProcessService} from '../code-process.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {firstValueFrom} from 'rxjs';
@Component({
  selector: 'app-finish',
  standalone: true,
  imports: [],
  templateUrl: './finish.component.html',
  styleUrl: './finish.component.css'
})
export class FinishComponent implements OnInit, OnDestroy{
  @Input() git_url: string = ''; // Accept prevFolder as an Input
  constructor(
    private codeProcessService: CodeProcessService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      this.git_url = params['git_url'] || 'https://github.com/fastapi/fastapi.git';
    });
  }

  async completeFinish(){
    await firstValueFrom(this.codeProcessService.activate_tmp_files(this.git_url));
  }

  ngOnDestroy() {
  }
}
