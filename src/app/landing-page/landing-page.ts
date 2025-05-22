import {Component} from '@angular/core';
import {TabsComponent} from './tabs/tabs.component';
import {LanguageSelectorComponent} from './language-selector/language-selector.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    TabsComponent,
    LanguageSelectorComponent
  ],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css'
})
export class LandingPage {

}
