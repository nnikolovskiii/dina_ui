import {ChangeDetectorRef, Component, ElementRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {FormsModule} from '@angular/forms';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule, MatSnackBarModule],
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
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
  }


  register() {
    if (this.password === this.passwordAgain) {
      this.authService.register(
        this.email,
        this.password,
        this.fullName
      ).subscribe({
        next: () => {
          this.snackBar.open('Registration successful! Please log in.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registration failed', err);
          this.snackBar.open('Registration failed. Please try again.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      console.log("Passwords do not match");
      this.snackBar.open('Passwords do not match', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    }
  }

  navigateToLink(link: string) {
    this.router.navigate(['/' + link]);
  }
}
