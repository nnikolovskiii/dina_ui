import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, MatSnackBarModule, NgClass, NgIf],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  signInForm: FormGroup;
  registrationSuccess = false;
  registrationError = '';
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.signInForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3), this.fullNameFormatValidator()]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      passwordAgain: ['', Validators.required]
    }, { validator: this.checkPasswords });
  }

  // Custom validator for full name format (name surname)
  fullNameFormatValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const value = control.value;

      if (!value) {
        return null; // Let required validator handle empty values
      }

      // Check if the full name contains at least one space between words
      const nameParts = value.trim().split(/\s+/);
      const validFormat = nameParts.length >= 2 && nameParts[0].length > 0 && nameParts[1].length > 0;

      return validFormat ? null : { invalidFormat: true };
    };
  }

  // Custom validator to check if passwords match
  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('passwordAgain')?.value;

    return password === confirmPassword ? null : { notSame: true };
  }

  // Helper method to get border color class based on field state
  getInputBorderClass(controlName: string): string {
    const control = this.signInForm.get(controlName);
    if (!control) return 'border-gray-300';

    if (control.touched || control.dirty) {
      return control.valid ? 'border-green-500 focus:border-green-500 focus:ring-green-500' :
                             'border-red-500 focus:border-red-500 focus:ring-red-500';
    }

    return 'border-gray-300';
  }

  // Helper method to check if the field is invalid and touched/dirty
  isFieldInvalid(controlName: string): boolean {
    const control = this.signInForm.get(controlName);
    return control ? (control.invalid && (control.touched || control.dirty)) : false;
  }

  // Helper method to get specific error message
  getErrorMessage(controlName: string): string {
    const control = this.signInForm.get(controlName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'This field is required';
    if (control.errors['minlength']) return `Must be at least ${control.errors['minlength'].requiredLength} characters`;
    if (control.errors['email']) return 'Please enter a valid email address';
    if (control.errors['invalidFormat']) return 'Full name must be in format "name surname"';

    return 'Invalid input';
  }

  // Helper method to check if passwords match
  passwordsMatch(): boolean {
    return this.signInForm.errors?.['notSame'] &&
           (this.signInForm.get('passwordAgain')?.touched || this.signInForm.get('passwordAgain')?.dirty);
  }

  register() {
    if (this.signInForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.registrationError = '';
      const formValues = this.signInForm.value;

      this.authService.register(
        formValues.email,
        formValues.password,
        formValues.fullName
      ).subscribe({
        next: () => {
          // Show success message
          this.registrationSuccess = true;

          // Navigate to login page after a delay
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Registration failed', err);
          this.registrationError = 'Registration failed. Please try again.';

          this.snackBar.open('Registration failed. Please try again.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    } else if (!this.isSubmitting) {
      // Mark all fields as touched to trigger validation visual feedback
      Object.keys(this.signInForm.controls).forEach(key => {
        const control = this.signInForm.get(key);
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
