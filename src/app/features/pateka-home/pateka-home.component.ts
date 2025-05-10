import {Component} from '@angular/core';
import {VideoPlayerComponent} from '../../video-player/video-player.component';
import {TabsComponent} from '../../tabs/tabs.component';
import {LanguageSelectorComponent} from '../../language-selector/language-selector.component';

@Component({
  selector: 'app-pateka-home',
  standalone: true,
  imports: [
    TabsComponent,
    LanguageSelectorComponent
  ],
  templateUrl: './pateka-home.component.html',
  styleUrl: './pateka-home.component.css'
})
export class PatekaHomeComponent {

}
