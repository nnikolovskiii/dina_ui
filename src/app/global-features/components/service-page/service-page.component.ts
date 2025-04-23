import { Component } from '@angular/core';
import {CompanyTitleComponent} from '../company-title/company-title.component';
import {UnderliningTextComponent} from '../underlining-text/underlining-text.component';
import {AuthService} from '../../../features/auth/services/auth/auth.service';
import {Router} from '@angular/router';
import {TitleButtonCardComponent} from '../title-button-card/title-button-card.component';
import {BrowswerFrameComponent} from '../browswer-frame/browswer-frame.component';
import {FooterComponent} from '../footer/footer.component';
import {UnderTheHoodComponent} from '../under-the-hood/under-the-hood.component';

@Component({
  selector: 'app-service-page',
  standalone: true,
  imports: [
    UnderliningTextComponent,
    TitleButtonCardComponent,
    BrowswerFrameComponent,
    FooterComponent,
    UnderTheHoodComponent
  ],
  templateUrl: './service-page.component.html',
  styleUrl: './service-page.component.css'
})
export class ServicePageComponent {

  constructor(private authService: AuthService, private router: Router,
  ) {
  }
  navigateToLink(link: string) {
    this.router.navigate(['/' + link]);
  }


}
