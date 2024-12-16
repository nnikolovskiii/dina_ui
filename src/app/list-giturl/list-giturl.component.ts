import { Component } from '@angular/core';
import {firstValueFrom, Observable, switchMap} from 'rxjs';
import {CodeProcessService} from '../code-process.service';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule, Location} from '@angular/common';
import {GitUrl} from '../models/git-url';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-list-giturl',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list-giturl.component.html',
  styleUrl: './list-giturl.component.css'
})
export class ListGiturlComponent {
  git_repos: GitUrl[] | null = null;

  constructor(
    private codeProcessService: CodeProcessService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  ngOnInit(): void {
    let git_repos_obj = localStorage.getItem('git_repos');

    if (git_repos_obj) {
      let git_repos = JSON.parse(git_repos_obj);
      let urls = git_repos.map((obj: { id: string; url: string; active: boolean }) => obj.url);
      let active_status = git_repos.map((obj: { id: string; url: string; active: boolean }) => obj.active);

      // First operation: Change active repos
      this.codeProcessService.change_active_repos(urls, active_status)
        .pipe(
          // After change_active_repos completes, proceed to get_git_urls
          switchMap(() => {
            // Remove item after change_active_repos completes
            localStorage.removeItem('git_repos');
            return this.codeProcessService.get_git_urls();
          })
        )
        .subscribe({
          next: (data) => {
            this.git_repos = data.map((git_url) => git_url);
          },
          error: (error) => {
            console.error('Error during operation:', error);
          },
          complete: () => {
            console.log('Operation completed successfully.');
          }
        });
    } else {
      // If no localStorage item, directly fetch git URLs
      this.codeProcessService.get_git_urls().subscribe({
        next: (data) => {
          this.git_repos = data.map((git_url) => git_url);
        },
        error: (error) => {
          console.error('Error fetching git URLs:', error);
        },
        complete: () => {
          console.log('Fetch operation completed.');
        }
      });
    }
  }


  getName(git_url:string){
    let li = git_url.split("/")
    return li[li.length-1].split(".")[0]
  }

  getGitUser(git_url:string){
    let li = git_url.split("/")
    return li[li.length-2]
  }

  toggleButtonAction(git_url: GitUrl){
    git_url.active = !git_url.active;
    localStorage.setItem('git_repos', JSON.stringify(this.git_repos));
  }
}
