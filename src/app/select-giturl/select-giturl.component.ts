import { Component } from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {CodeProcessService} from '../code-process.service';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule, Location, NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-select-giturl',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgOptimizedImage],
  templateUrl: './select-giturl.component.html',
  styleUrl: './select-giturl.component.css'
})

export class SelectGiturlComponent {
  gitUrl: string = ''; // Variable to bind the Git URL
  override: boolean = false;
  loading: boolean = false; // Flag for loading animation

  constructor(
    private codeProcessService: CodeProcessService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  async extractLibraries(git_url: string, override: boolean){
    this.loading = true; // Show the loading animation
    await firstValueFrom(this.codeProcessService.extract_library(git_url, override));
    this.router.navigate(['/code-process'], { queryParams: { git_url: git_url } });
  }

  goBack() {
    this.location.back();
  }
}
