import {Component, Renderer2} from '@angular/core';
import {TabsComponent} from './components/tabs/tabs.component';
import {LanguageSelectorComponent} from './components/language-selector/language-selector.component';
import {NgClass} from '@angular/common';
import {SandwichToggleComponent} from './components/sandwich-toggle/sandwich-toggle.component';
import {FooterComponent} from './components/footer/footer.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    TabsComponent,
    LanguageSelectorComponent,
    NgClass,
    SandwichToggleComponent,
    FooterComponent,
    TranslateModule
  ],
  templateUrl: './landing-page.html',
  styleUrls: ['./landing-page-web.css', './landing-page-mobile.css']
})
export class LandingPage {
  isMobileMenuOpen = false;

  constructor(private renderer: Renderer2, private translate: TranslateService) {
    // The language is already set in the LanguageSelectorComponent
  }

  // Store event listeners for later removal
  private wheelListener: any;
  private touchmoveListener: any;
  private touchstartListener: any;
  private keydownListener: any;

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    if (this.isMobileMenuOpen) {
      // Disable scrolling when menu is open
      this.renderer.addClass(document.body, 'no-scroll');
      this.renderer.addClass(document.documentElement, 'no-scroll');

      // Additional measures to prevent scrolling
      document.ontouchmove = (e) => {
        e.preventDefault();
      };

      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.style.overflow = 'hidden';

      // Prevent wheel scrolling
      this.wheelListener = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      document.addEventListener('wheel', this.wheelListener, { passive: false });

      // Prevent touchmove scrolling
      this.touchmoveListener = (e: TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      document.addEventListener('touchmove', this.touchmoveListener, { passive: false });

      // Prevent touchstart scrolling
      this.touchstartListener = (e: TouchEvent) => {
        if (e.touches.length > 1) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      document.addEventListener('touchstart', this.touchstartListener, { passive: false });

      // Prevent keyboard scrolling
      this.keydownListener = (e: KeyboardEvent) => {
        // Prevent arrow keys, space, page up/down, home, end
        if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      document.addEventListener('keydown', this.keydownListener);
    } else {
      // Enable scrolling when menu is closed
      this.renderer.removeClass(document.body, 'no-scroll');
      this.renderer.removeClass(document.documentElement, 'no-scroll');

      // Remove additional measures
      document.ontouchmove = null;

      // Remove event listeners
      if (this.wheelListener) {
        document.removeEventListener('wheel', this.wheelListener);
      }
      if (this.touchmoveListener) {
        document.removeEventListener('touchmove', this.touchmoveListener);
      }
      if (this.touchstartListener) {
        document.removeEventListener('touchstart', this.touchstartListener);
      }
      if (this.keydownListener) {
        document.removeEventListener('keydown', this.keydownListener);
      }

      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }
}
