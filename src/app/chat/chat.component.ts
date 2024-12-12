import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import * as marked from 'marked';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule, ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  private ws: WebSocket | undefined;
  public inputMessage: string = '';
  public messages: string = '';  // Raw Markdown messages
  public sanitizedMessages: SafeHtml;
  public userMessages: string[] = []
  public assistantMessages: string[] = []
  public isFirst: boolean = true;

  constructor(private sanitizer: DomSanitizer) {
    this.sanitizedMessages = this.sanitizer.bypassSecurityTrustHtml('');
  }

  ngOnInit(): void {
    this.ws = new WebSocket("ws://localhost:5000/websocket/");

    this.ws.onopen = () => {
      console.log("WebSocket connection opened.");
    };

    this.ws.onmessage = (event: MessageEvent) => {
      this.messages += event.data + "";
      this.updateSanitizedMessages();
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };
  }

  ngOnDestroy(): void {
    if (this.ws) {
      this.ws.close();
    }
  }

  sendMessage(event: Event): void {
    this.sanitizedMessages =   this.sanitizer.bypassSecurityTrustHtml('');
    event.preventDefault();
    if (this.messages.trim() !== '') {
      this.assistantMessages.push(this.messages);
    }

    if (this.ws && this.inputMessage.trim() !== '') {
      this.userMessages.push(this.inputMessage);
      this.ws.send(this.inputMessage);
      this.isFirst = false
      this.messages = '';
    }

    console.log(this.assistantMessages)
    console.log(this.userMessages)
  }

  updateSanitizedMessages(): void {
    const html = marked.parse(this.messages);
    if (typeof html === 'string') {
      this.sanitizedMessages = this.sanitizer.bypassSecurityTrustHtml(html);
    }
  }

  getMarkedMessage(message: string): string | Promise<string> {
     return marked.parse(message);
  }




}
