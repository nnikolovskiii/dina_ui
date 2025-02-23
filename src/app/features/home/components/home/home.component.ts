import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {BlobComponent} from '../../../../global-features/components/blob/blob.component';
import {HeaderComponent} from "../../../../global-features/components/header/header.component";

@Component({
  selector: 'app-home',
  standalone: true,
    imports: [
        BlobComponent,
        HeaderComponent
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
