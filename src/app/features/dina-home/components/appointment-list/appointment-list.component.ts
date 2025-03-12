// appointment-list.component.ts
import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CollectionDataService } from '../../services/collection-data/collection-data.service';

export  interface  Appointment{
  id: number;
  email: string;
  appointment: string;
  // title: string;
  // location: string;
  // description: string;
}

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent {
  appointments: Appointment[] = [];
  totalAppointments: number = 0;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(private collectionDataService: CollectionDataService) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.collectionDataService.getCollectionData('Appointment', this.currentPage)
      .subscribe({
        next: (response) => {
          this.appointments = response.appointments;
          this.totalAppointments = response.total;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load appointments. Please try again later.';
          this.isLoading = false;
          console.error(err);
        }
      });
  }

  get totalPages(): number {
    return Math.ceil(this.totalAppointments / this.itemsPerPage);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadAppointments();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadAppointments();
    }
  }
}
