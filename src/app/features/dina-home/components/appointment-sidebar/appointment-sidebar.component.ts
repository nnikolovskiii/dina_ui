import {Component, EventEmitter, Inject, Input, OnInit, Output, Renderer2} from '@angular/core';
import {CommonModule, DOCUMENT, NgForOf} from '@angular/common';
import {ChatService} from '../../../chat/services/chat.service';
import {Router} from '@angular/router';
import {AppointmentListComponent} from '../appointment-list/appointment-list.component';

@Component({
  selector: 'app-appointment-sidebar',
  standalone: true,
  imports: [
    NgForOf, CommonModule, AppointmentListComponent
  ],
  templateUrl: './appointment-sidebar.component.html',
  styleUrl: './appointment-sidebar.component.css'
})
export class AppointmentSidebarComponent implements OnInit {
  @Output() toggleRequested = new EventEmitter<void>();
  @Input() isVisible: boolean = false;
  public lightMode: boolean = false;


  constructor(
    private chatService: ChatService,
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.updateTheme()
  }


  toggleHistoryBar() {
    this.toggleRequested.emit();

  }


  private updateTheme() {
    if (this.lightMode) {
      this.renderer.addClass(this.document.body, 'dark-theme');
      this.renderer.removeClass(this.document.body, 'light-theme');
    } else {
      this.renderer.addClass(this.document.body, 'light-theme');
      this.renderer.removeClass(this.document.body, 'dark-theme');
    }
  }

  refreshCount: number = 0;

  refreshAppointments() {
    this.refreshCount++;
  }
}

