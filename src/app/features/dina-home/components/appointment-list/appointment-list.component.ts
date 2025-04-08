// appointment-list.component.ts
import {Component, Input, SimpleChanges} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CollectionDataService } from '../../services/collection-data/collection-data.service';

export  interface  Appointment{
  id: number;
  email: string;
  appointment: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent {
  @Input() width: string = '250px';
  appointments: Appointment[] = [];
  totalAppointments: number = 0;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(private collectionDataService: CollectionDataService) { }

  @Input() refreshTrigger: number = 0; // Add this input

  ngOnChanges(changes: SimpleChanges) {
    if (changes['refreshTrigger']) {
      this.loadAppointments();
    }
  }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.collectionDataService.getCollectionData('Appointment', 1)
      .subscribe({
        next: (response) => {
          this.appointments = response.items;
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
