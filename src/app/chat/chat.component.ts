import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as marked from 'marked';
import { ChatService } from '../chat.service';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  private ws: WebSocket | undefined;
  public inputMessage: string = '';
  public messages: string = '';  // Raw Markdown messages
  public sanitizedMessages: SafeHtml;
  public userMessages: string[] = [];
  public assistantMessages: string[] = [];
  public isFirst: boolean = true;

  constructor(private sanitizer: DomSanitizer, private chatService: ChatService) {
    this.sanitizedMessages = this.sanitizer.bypassSecurityTrustHtml('');
  }

  async ngOnInit(): Promise<void> {
    // Restore messages from localStorage
    let savedUserMessages = localStorage.getItem('userMessages');
    let savedAssistantMessages = localStorage.getItem('assistantMessages');

    if (savedUserMessages && savedAssistantMessages) {
       let userMessages = JSON.parse(savedUserMessages);
       let assistantMessages= JSON.parse(savedAssistantMessages);
       console.log(userMessages);
       console.log(assistantMessages);

      await firstValueFrom(this.chatService.add_chat(userMessages, assistantMessages));
    }

    this.clearChat()

    this.updateSanitizedMessages();

    this.ws = new WebSocket("ws://localhost:5000/websocket/");

    this.ws.onopen = () => {
      console.log("WebSocket connection opened.");
    };

    this.ws.onmessage = (event: MessageEvent) => {
      if (event.data == "<ASTOR>"){
        this.isFirst = true;
        this.assistantMessages.push(this.messages);
      }
      this.messages += event.data + "";
      this.updateSanitizedMessages();
      this.saveChatData(); // Save updated data
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };
  }

  clearChat(): void {
    localStorage.removeItem('userMessages');
    localStorage.removeItem('assistantMessages');
  }

  ngOnDestroy(): void {
    this.assistantMessages.push(this.messages);
    if (this.ws) {
      this.ws.close();
    }
  }

  sendMessage(event: Event): void {
    this.sanitizedMessages = this.sanitizer.bypassSecurityTrustHtml('');
    event.preventDefault();


    // Send the message
    if (this.ws && this.inputMessage.trim() !== '') {
      this.ws.send(JSON.stringify([this.inputMessage, this.userMessages, this.assistantMessages]));
      this.userMessages.push(this.inputMessage);
      this.isFirst = false;
      this.messages = '';
    }

    // Save chat data after sending a message
    this.saveChatData();
  }

  updateSanitizedMessages(): void {
    const html = marked.parse(this.messages);
    if (typeof html === 'string') {
      this.sanitizedMessages = this.sanitizer.bypassSecurityTrustHtml(html);
    }
  }

  saveChatData(): void {
    // Save messages to localStorage
    localStorage.setItem('userMessages', JSON.stringify(this.userMessages));
    localStorage.setItem('assistantMessages', JSON.stringify(this.assistantMessages));
  }

  getMarkedMessage(message: string): string | Promise<string> {
    return marked.parse(message);
  }
}
