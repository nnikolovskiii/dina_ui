import {Component, OnInit, OnDestroy, Input, ViewEncapsulation} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import * as marked from 'marked';
import {ChatService} from '../chat.service';
import {firstValueFrom} from 'rxjs';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() chat_id: string = "";
  private ws: WebSocket | undefined;
  public inputMessage: string = '';
  public messages: string = '';  // Raw Markdown messages
  public sanitizedMessages: SafeHtml;
  public userMessages: string[] = [];
  public assistantMessages: string[] = [];
  public newUserMessages: any[] = [];
  public newAssistantMessages: any[] = [];
  public isFirst: boolean = true;

  constructor(private sanitizer: DomSanitizer, private chatService: ChatService,private router: Router,  private route: ActivatedRoute,) {
    this.sanitizedMessages = this.sanitizer.bypassSecurityTrustHtml('');
  }

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(async (params) => {
      this.chat_id = params['chat_id'] || '';
      let savedUserMessages = localStorage.getItem('userMessages');
      let savedAssistantMessages = localStorage.getItem('assistantMessages');
      let chat_id = localStorage.getItem('chat_id');

      console.log(savedUserMessages, savedAssistantMessages, chat_id)


      if (chat_id && chat_id !== "" && savedUserMessages && savedAssistantMessages) {
        let userMessages = JSON.parse(savedUserMessages);
        let assistantMessages = JSON.parse(savedAssistantMessages);
        await firstValueFrom(this.chatService.update_chat(chat_id, userMessages, assistantMessages));
      } else if (savedUserMessages && savedAssistantMessages) {
        console.log("yes")
        let userMessages = JSON.parse(savedUserMessages);
        let assistantMessages = JSON.parse(savedAssistantMessages);
        console.log(userMessages, assistantMessages)
        await firstValueFrom(this.chatService.add_chat(userMessages, assistantMessages));
      }

      this.clearChat()


      if (this.chat_id !== ""){
        let response = await firstValueFrom(this.chatService.get_chat_messages(this.chat_id));
        let user_message_objs = response["user_messages"]
        let assistant_message_objs = response["assistant_messages"]
        for (let i = 0; i < user_message_objs.length; i++) {
          this.userMessages.push(user_message_objs[i]["content"])
        }

        for (let i = 0; i < assistant_message_objs.length; i++) {
          this.assistantMessages.push(assistant_message_objs[i]["content"])
        }
      }

      this.updateSanitizedMessages();

      this.ws = new WebSocket("ws://localhost:5000/websocket/");

      this.ws.onopen = () => {
        console.log("WebSocket connection opened.");
      };

      this.ws.onmessage = (event: MessageEvent) => {
        if (event.data == "<ASTOR>") {
          this.isFirst = true;
          this.assistantMessages.push(this.messages);
          this.newAssistantMessages.push([this.messages, this.assistantMessages.length - 1]);
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
    });

  }

  clearChat(): void {
    localStorage.removeItem('userMessages');
    localStorage.removeItem('assistantMessages');
  }

  ngOnDestroy(): void {
    if (this.ws) {
      this.ws.close();
    }
  }

  sendMessage(): void {
    this.sanitizedMessages = this.sanitizer.bypassSecurityTrustHtml('');


    // Send the message
    if (this.ws && this.inputMessage.trim() !== '') {
      this.ws.send(JSON.stringify([this.inputMessage, this.userMessages, this.assistantMessages]));
      this.userMessages.push(this.inputMessage);
      this.newUserMessages.push([this.inputMessage, this.userMessages.length - 1]);
      this.isFirst = false;
      this.messages = '';
      this.inputMessage = ""
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
    localStorage.setItem('userMessages', JSON.stringify(this.newUserMessages));
    localStorage.setItem('assistantMessages', JSON.stringify(this.newAssistantMessages));
    localStorage.setItem('chat_id', this.chat_id);
  }

  getMarkedMessage(message: string): string | Promise<string> {
    return marked.parse(message);
  }

  handleKeyDown(event: KeyboardEvent, textarea: HTMLTextAreaElement): void {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        event.preventDefault();
        if (textarea.rows < 7) {
          textarea.rows += 1;
          this.inputMessage += '\n'; // Add a newline to the inputMessage
        }
      } else {
        // Prevent default Enter behavior and send the message
        event.preventDefault();
        this.sendMessage();
        textarea.rows = 1; // Reset rows after sending the message
      }
    }

    if (event.key === 'Backspace') {
      // Check if the last character in inputMessage is a newline
      if (this.inputMessage.endsWith('\n')) {
        event.preventDefault();
        textarea.rows = Math.max(1, textarea.rows - 1); // Decrease rows but ensure it doesn't go below 1
        this.inputMessage = this.inputMessage.slice(0, -1); // Remove the last character (newline)
      }
    }
  }

}
