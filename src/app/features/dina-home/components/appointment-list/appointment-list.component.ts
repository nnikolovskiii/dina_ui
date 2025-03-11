import { Component } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

interface Appointment {
  title: string;
  date: string;
  location: string;
  description?: string;
}


@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    DatePipe,
    CommonModule,
  ],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css'
})
export class AppointmentListComponent {
  appointments: Appointment[] = [
    // Sample data - replace with actual data
    {
      title: 'Doctor Consultation',
      date: '2024-03-20 14:30',
      location: 'City Medical Center',
      description: 'Annual physical checkup with Dr. Smith'
    },
    {
      title: 'Team Meeting',
      date: '2024-03-22 09:00',
      location: 'Office Conference Room',
      description: 'Quarterly project review'
    },
    {
      title: 'Doctor Consultation',
      date: '2024-03-20 14:30',
      location: 'City Medical Center',
      description: 'Annual physical checkup with Dr. Smith'
    },
    {
      title: 'Team Meeting',
      date: '2024-03-22 09:00',
      location: 'Office Conference Room',
      description: 'Quarterly project review'
    },
    {
      title: 'Doctor Consultation',
      date: '2024-03-20 14:30',
      location: 'City Medical Center',
      description: 'Annual physical checkup with Dr. Smith'
    },
    {
      title: 'Team Meeting',
      date: '2024-03-22 09:00',
      location: 'Office Conference Room',
      description: 'Quarterly project review'
    },
  ];

  currentPage = 1;
  itemsPerPage = 5;

  get displayedAppointments(): Appointment[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.appointments.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.appointments.length / this.itemsPerPage);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}
