import { Component } from '@angular/core';
import {BrowswerFrameComponent} from '../browswer-frame/browswer-frame.component';
import {FooterComponent} from '../footer/footer.component';
import {TitleButtonCardComponent} from '../title-button-card/title-button-card.component';
import {UnderTheHoodComponent} from '../under-the-hood/under-the-hood.component';
import {UnderliningTextComponent} from '../underlining-text/underlining-text.component';
import {AuthService} from '../../../features/auth/services/auth/auth.service';
import {Router} from '@angular/router';
import {ContributorComponent} from '../contributor/contributor.component';

@Component({
  selector: 'app-about-us-page',
  standalone: true,
  imports: [
    BrowswerFrameComponent,
    FooterComponent,
    TitleButtonCardComponent,
    UnderTheHoodComponent,
    UnderliningTextComponent,
    ContributorComponent
  ],
  templateUrl: './about-us-page.component.html',
  styleUrl: './about-us-page.component.css'
})
export class AboutUsPageComponent {
  constructor(private authService: AuthService, private router: Router,
  ) {
  }
  navigateToLink(link: string) {
    this.router.navigate(['/' + link]);
  }

}
