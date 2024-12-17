import {Component, OnInit} from '@angular/core';
import {Process} from '../models/process';
import {ProcessService} from '../process.service';
import {JsonPipe, NgForOf, NgIf} from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-process-list',
  standalone: true,
  imports: [
    NgForOf,
    JsonPipe,
    MatTabsModule,
    NgIf
  ],
  templateUrl: './process-list.component.html',
  styleUrl: './process-list.component.css'
})
export class ProcessListComponent implements OnInit {
  processMap: Map<string, Process[]> | undefined;

  constructor(private processService: ProcessService) {}

  ngOnInit() {
    this.processService.getProcesses().subscribe(
      (map: Map<string, Process[]>) => {
        this.processMap = map;
        console.log(this.processMap); // For debugging purposes
      },
      (error) => {
        console.error('Error fetching processes:', error);
        // Handle error appropriately, e.g., show error message to user
      }
    );

    console.log()
  }

  selectedStatus = 'ongoing';
  selectedType = 'docs';

  selectStatus(status: string) {
    this.selectedStatus = status;
  }

  selectType(type: string) {
    this.selectedType = type;
  }


  getEntries(type: string, status: string):Process[] {
    return this.processMap?.get(type+"_"+status) || [];
  }
}
