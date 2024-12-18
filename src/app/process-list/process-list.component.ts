import {Component, Input, OnInit} from '@angular/core';
import {Process} from '../models/process';
import {ProcessService} from '../process.service';
import {JsonPipe, Location, NgForOf, NgIf} from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import {ActivatedRoute, Router} from '@angular/router';
import {firstValueFrom} from 'rxjs';

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
  displayedProcesses: Process[] | undefined;
  @Input() finished: boolean = false;

  constructor(
    private processService: ProcessService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      this.finished = params['finished'] || false;
      if (this.finished) {
        this.setToFinished()
      }else{
        this.setToOngoing()
      }


      console.log()
    });
  }

  selectedStatus = 'ongoing';
  selectedType = 'docs';

  selectStatus(status: string) {
    this.selectedStatus = status;
  }

  selectType(type: string) {
    this.selectedType = type;
  }

  changeDisplayProcesses(status: string) {
    this.selectedStatus = status;
    if (status === 'ongoing') {
      this.setToOngoing();
    } else if (status === 'finished') {
      this.setToFinished();
    }
  }

  async refresh(progressId:string, ind: number) {
    console.log("refreshed")
    let process = await firstValueFrom(this.processService.refreshProgress(progressId))
    if (this.displayedProcesses) {
      this.displayedProcesses[ind] = process;
    }
  }

  setToFinished() {
    this.processService.getFinishedProcesses().subscribe(
      (processes: Process[]) => {
        this.displayedProcesses = processes;
      },
      (error) => {
        console.error('Error fetching processes:', error);
        // Handle error appropriately, e.g., show error message to user
      }
    );
  }

  setToOngoing() {
    this.processService.getOngoingProcesses().subscribe(
      (processes: Process[]) => {
        this.displayedProcesses = processes;
      },
      (error) => {
        console.error('Error fetching processes:', error);
        // Handle error appropriately, e.g., show error message to user
      }
    );
  }
}
