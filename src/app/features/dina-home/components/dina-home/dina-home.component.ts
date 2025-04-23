import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../../auth/services/auth/auth.service';
import {Router} from '@angular/router';
import {NgForOf} from '@angular/common';
import {BlobComponent} from '../../../../global-features/components/blob/blob.component';
import {
  UnderliningTextComponent
} from '../../../../global-features/components/underlining-text/underlining-text.component';
import {MovingBallsComponent} from '../../../../global-features/components/moving-balls/moving-balls.component';
import {
  TitleButtonCardComponent
} from '../../../../global-features/components/title-button-card/title-button-card.component';
import {BrowswerFrameComponent} from '../../../../global-features/components/browswer-frame/browswer-frame.component';
import {QuoteShowerComponent} from '../../../../global-features/components/quote-shower/quote-shower.component';
import {ImageCardComponent} from '../../../../global-features/components/image-card/image-card.component';
import {NoCostBanterComponent} from '../../../../global-features/components/no-cost-banter/no-cost-banter.component';
import {NoCostSectionComponent} from '../../../../global-features/components/no-cost-section/no-cost-section.component';
import {CompanyTitleComponent} from '../../../../global-features/components/company-title/company-title.component';
import {FooterComponent} from '../../../../global-features/components/footer/footer.component';

@Component({
  selector: 'app-dina-home',
  standalone: true,
  imports: [
    UnderliningTextComponent,
    TitleButtonCardComponent,
    BrowswerFrameComponent,
    QuoteShowerComponent,
    ImageCardComponent,
    NoCostBanterComponent,
    NoCostSectionComponent,
    CompanyTitleComponent,
    FooterComponent
  ],
  templateUrl: './dina-home.component.html',
  styleUrl: './dina-home.component.css'
})
export class DinaHomeComponent implements OnInit {
  userData: any;
  @ViewChild('container') container!: ElementRef;


  constructor(private authService: AuthService, private router: Router,
  ) {
  }

  ngOnInit() {
    this.loadUserData();
    console.log(this.userData)
  }

  loadUserData() {
    this.authService.getProtectedData().subscribe({
      next: (data) => {
        this.userData = data
        console.log(this.userData)
      },
      error: (err) => console.error('Failed to load data:', err)
    });
  }

  navigateToLink(link: string) {
    this.router.navigate(['/' + link]);
  }
}
