import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import {AuthService, GenderEnum, UserInfo} from '../../../features/auth/services/auth/auth.service';
import {CollectionDataService} from '../../../features/dina-home/services/collection-data/collection-data.service';
import {StarButtonComponent} from '../../../global-features/buttons/star-button/star-button.component';



@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    StarButtonComponent
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent implements OnInit {
  // Form group for validation
  userForm: FormGroup;

  // Form model for collecting user information
  userModel: UserInfo = {
    e_id: '',
    father_name: '',
    mother_name: '',
    date_of_birth: new Date(),
    gender: GenderEnum.MALE,
    living_address: '',
    passport_number: '',
    id_card_number: '',
  };

  private readonly collectionName = 'UserInfo';
  addUserSuccess = false;
  addUserError = '';
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private collectionDataService: CollectionDataService,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize the form with validators
    this.userForm = this.formBuilder.group({
      e_id: ['', Validators.required],
      father_name: ['', Validators.required],
      mother_name: ['', Validators.required],
      date_of_birth: ['', [Validators.required, this.dateValidator]],
      gender: [GenderEnum.MALE, Validators.required],
      living_address: ['', Validators.required],
      passport_number: ['', Validators.required],
      id_card_number: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Get the email from the currently signed-in user
    this.authService.getProtectedData().subscribe(user => {
      if (user && user.email) {
        this.userModel.email = user.email;
      }
    });
  }

  // Custom validator for date
  dateValidator(control: any) {
    const dateValue = new Date(control.value);
    const today = new Date();

    // Check if date is valid
    if (isNaN(dateValue.getTime())) {
      return { invalidDate: true };
    }

    // Check if date is not in the future
    if (dateValue > today) {
      return { futureDate: true };
    }

    // Check if the person's age is reasonable (e.g., not older than 120 years)
    const maxAge = 120;
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - maxAge);

    if (dateValue < minDate) {
      return { tooOld: true };
    }

    return null;
  }

  // Getter for easy access to form fields
  get f() {
    return this.userForm.controls;
  }

  addUser(): void {
    this.submitted = true;

    // Stop if the form is invalid
    if (this.userForm.invalid) {
      return;
    }

    // Update the userModel with form values
    this.userModel.e_id = this.f['e_id'].value;
    this.userModel.father_name = this.f['father_name'].value;
    this.userModel.mother_name = this.f['mother_name'].value;
    this.userModel.date_of_birth = new Date(this.f['date_of_birth'].value);
    this.userModel.gender = this.f['gender'].value;
    this.userModel.living_address = this.f['living_address'].value;
    this.userModel.passport_number = this.f['passport_number'].value;
    this.userModel.id_card_number = this.f['id_card_number'].value;

    // Send data to the server
    this.authService.addUserInfo(this.userModel)
      .subscribe({
        next: (response) => {
          console.log('User added successfully', response);
          this.addUserSuccess = true;
          this.addUserError = '';
          this.resetForm();

          // Redirect to the chat page on success
          this.router.navigate(['/chat']);
        },
        error: (error) => {
          console.error('Error adding user', error);
          this.addUserSuccess = false;

          // Extract and display the detailed validation error if available
          if (error.error && error.error.details && error.error.details.length > 0) {
            this.addUserError = `Validation error: ${error.error.details.map((detail: any) => detail.message || detail).join(', ')}`;
          } else if (error.error && error.error.message) {
            this.addUserError = `Error: ${error.error.message}`;
          } else {
            this.addUserError = 'Failed to add user. Please try again.';
          }
        }
      });
  }

  resetForm(): void {
    this.submitted = false;
    this.userForm.reset({
      gender: GenderEnum.MALE
    });

    // Preserve the ID and email
    const currentEmail = this.userModel.email;
    const currentId = this.userModel.id;

    this.userModel = {
      id: currentId,
      e_id: '',
      father_name: '',
      mother_name: '',
      date_of_birth: new Date(),
      gender: GenderEnum.MALE,
      living_address: '',
      passport_number: '',
      id_card_number: '',
      email: currentEmail
    };
  }
}
