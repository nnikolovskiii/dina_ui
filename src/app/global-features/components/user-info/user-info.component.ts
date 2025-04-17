import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router'; // Add Router import
import { StarButtonComponent } from '../../buttons/star-button/star-button.component';
import { CollectionDataService } from '../../../features/dina-home/services/collection-data/collection-data.service';
import { AuthService, UserInfo } from '../../../features/auth/services/auth/auth.service';

enum GenderEnum {
  MALE = "male",
  FEMALE = "female"
}

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    StarButtonComponent
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent implements OnInit {
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

  constructor(
    private collectionDataService: CollectionDataService,
    private authService: AuthService,
    private router: Router // Inject Router
  ) {}

  ngOnInit(): void {
    // Get the email from the currently signed-in user
    this.authService.getProtectedData().subscribe(user => {
      if (user && user.email) {
        this.userModel.email = user.email;
      }
    });
  }

  addUser(): void {
    // Use the AuthService's addUserInfo method instead of CollectionDataService
    console.log(this.userModel)
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

  // resetForm method remains unchanged
  resetForm(): void {
    const currentEmail = this.userModel.email; // Preserve the email
    this.userModel = {
      id: this.userModel.id, // Preserve the ID
      name: '',
      surname: '',
      e_id: '',
      father_name: '',
      mother_name: '',
      date_of_birth: new Date(),
      gender: GenderEnum.MALE,
      living_address: '',
      passport_number: '',
      id_card_number: '',
      email: currentEmail // Keep the user's email
    };
  }
}
