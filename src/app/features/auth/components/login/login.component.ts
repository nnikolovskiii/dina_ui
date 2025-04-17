import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatSnackBarModule, NgClass, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  loginSuccess = false;
  loginError = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  // Helper method to check if the field is invalid and touched/dirty
  isFieldInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return control ? (control.invalid && (control.touched || control.dirty)) : false;
  }

  // Helper method to get specific error message
  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'This field is required';
    if (control.errors['minlength']) return `Must be at least ${control.errors['minlength'].requiredLength} characters`;
    if (control.errors['email']) return 'Please enter a valid email address';

    return 'Invalid input';
  }

  login() {
    if (this.loginForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.loginError = '';
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          // Show success message
          this.loginSuccess = true;

          // Navigate to dashboard after a delay
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Login failed', err);
          this.loginError = 'Invalid email or password. Please try again.';

          this.snackBar.open('Login failed. Please check your credentials.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    } else if (!this.isSubmitting) {
      // Mark all fields as touched to trigger validation visual feedback
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });

      this.snackBar.open('Please fix the form errors before submitting.', 'Close', {
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
