import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {Folder} from '../models/folder';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CodeProcessService} from '../code-process.service';
import {ChatService} from '../chat.service';
import {Chat} from '../models/chat';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css'
})
export class ChatListComponent {
  chats$: Observable<Chat[]> | null = null;

  constructor(private chatService: ChatService, private router: Router, private route: ActivatedRoute,) {
  }

  ngOnInit(): void {
    this.chats$ = this.chatService.getChats();
  }
}
