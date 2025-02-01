import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
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
  @Input() isVisible :boolean = false;

  constructor(
    private chatService: ChatService,
    private router: Router,
  ) {
  }

  async ngOnInit(): Promise<void> {
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

  getChats(){
    this.chatService.getChats().subscribe(
      (chats: any) => {
        this.chats = chats;
        console.log(this.chats["today"])
      })
  }
}
