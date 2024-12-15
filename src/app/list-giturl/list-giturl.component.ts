import { Component } from '@angular/core';
import {firstValueFrom, Observable} from 'rxjs';
import {CodeProcessService} from '../code-process.service';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule, Location} from '@angular/common';
import {GitUrl} from '../models/git-url';

@Component({
  selector: 'app-list-giturl',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-giturl.component.html',
  styleUrl: './list-giturl.component.css'
})
export class ListGiturlComponent {
  git_repos$: Observable<GitUrl[]> | null = null;

  constructor(
    private codeProcessService: CodeProcessService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.git_repos$ = this.codeProcessService.get_git_urls();
    console.log(this.git_repos$);
  }

  getName(git_url:string){
    let li = git_url.split("/")
    return li[li.length-1].split(".")[0]
  }

  getGitUser(git_url:string){
    let li = git_url.split("/")
    return li[li.length-2]
  }
}
