import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {BlobComponent} from '../../../../global-features/components/blob/blob.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    BlobComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  navigateToChat(){
    this.router.navigate(['/chat'],);
  }

  navigateToExtractUrl(){
    this.router.navigate(['/extract-url'],);
  }

  navigateToUrls(){
    this.router.navigate(['/collections'],);
  }

  navigateToProgress(){
    this.router.navigate(['/process'],);
  }
}
