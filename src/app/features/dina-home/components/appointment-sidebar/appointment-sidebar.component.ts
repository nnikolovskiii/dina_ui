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
    this.getChats()
  }

  chats: any | null = null


  toggleHistoryBar() {
    this.toggleRequested.emit();

  }

  getChatsByTime(timePeriod: string) {
    if (this.chats != null) {
      return this.chats[timePeriod];
    }
  }

  selectChat(chatId: string) {
    this.router.navigate(['/chat'], {queryParams: {chat_id: chatId}})
      .then(() => {
        window.location.reload();
      });
  }

  getChats() {
    this.chatService.getChats().subscribe(
      (chats: any) => {
        this.chats = chats;
        console.log(this.chats["today"])
      })
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

}

