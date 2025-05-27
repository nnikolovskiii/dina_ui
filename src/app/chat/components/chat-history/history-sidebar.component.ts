import {Component, EventEmitter, Inject, Input, OnInit, Output, Renderer2} from '@angular/core';
import {CommonModule, DOCUMENT} from '@angular/common';
import {ChatService} from '../../services/chat.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-history-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history-sidebar.component.html',
  styleUrl: './history-sidebar.component.css'
})
export class HistorySidebarComponent implements OnInit {
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
    if (this.isVisible) {
      this.getChats()
      console.log("getChats")
    }
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
