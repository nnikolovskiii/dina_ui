import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../features/auth/services/auth/auth.service';
import { RouterLink } from '@angular/router';
import { NgForOf, NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  isLoggedIn = false;
  userData: any = null;
  showDropdown = false;

  // List of avatar colors to choose from based on user's name
  private avatarColors = [
    'var(--avatar-yellow)',
    '#4F46E5', // Indigo
    '#7C3AED', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#10B981'  // Emerald
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getProtectedData().subscribe({
      next: (data) => {
        // Handle both nested and flat responses
        this.userData = data.data || data;
        this.isLoggedIn = !!this.userData;
      },
      error: (err) => {
        console.error('Auth error:', err);
        this.isLoggedIn = false;
        this.userData = null;
      }
    });
  }

  // Get user initials for avatar
  get userInitials(): string {
    const name = this.userData?.full_name || this.userData?.name || '';
    if (!name) return '?';

    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return nameParts[0][0]?.toUpperCase() || '?';
  }

  // Generate a consistent color for user avatar based on their name
  getUserAvatarColor(): string {
    const name = this.userData?.full_name || this.userData?.name || '';
    if (!name) return this.avatarColors[0];

    // Use the sum of character codes to pick a color
    const charSum = name.split('').reduce((sum: number, char: string) => sum + char.charCodeAt(0), 0);
    const colorIndex = charSum % this.avatarColors.length;

    return this.avatarColors[colorIndex];
  }

  // Toggle dropdown menu
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  // Close dropdown when clicking outside
  closeDropdown(event: Event) {
    event.stopPropagation();
    this.showDropdown = false;
  }

  // Close dropdown when clicking Escape key
  @HostListener('document:keydown.escape')
  onEscapePress() {
    this.showDropdown = false;
  }

  // Handle logout
  logout() {
    // Close dropdown first
    this.showDropdown = false;

    // Implement logout functionality
    this.authService.logout().subscribe({
      next: () => {
        this.isLoggedIn = false;
        this.userData = null;
      },
      error: (err) => console.error('Logout failed:', err)
    });
  }
}
