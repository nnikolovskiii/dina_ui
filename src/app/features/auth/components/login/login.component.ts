import {ChangeDetectorRef, Component, ElementRef} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = ""
  password: string = ""

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
  }

  login(){
    this.authService.login(
      this.email,
      this.password,
    ).subscribe({
      next: () => window.location.href = '/',
      error: (err) => console.error('Login failed', err)
    });
  }

  navigateToLink(link: string) {
    this.router.navigate(['/'+link]);
  }
}
