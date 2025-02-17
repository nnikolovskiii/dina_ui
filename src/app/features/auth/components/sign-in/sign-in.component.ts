import {ChangeDetectorRef, Component, ElementRef} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {ChatService} from '../../../chat/services/chat.service';
import {FlagService} from '../../../show-process/services/flag/flag.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  fullName: string = "";
  email: string = "";
  password: string = "";
  passwordAgain: string = "";

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef,
    private cdRef: ChangeDetectorRef
  ) {
  }


  register() {
    if (this.password === this.passwordAgain) {
      this.authService.register(
        this.email,
        this.password,
        this.fullName
      ).subscribe({
        next: () => window.location.href = '/',
        error: (err) => console.error('Registration failed', err)
      });
    } else {
      console.log("Passwords do not match");
    }
  }

  navigateToLink(link: string) {
    this.router.navigate(['/'+link]);
  }
}
