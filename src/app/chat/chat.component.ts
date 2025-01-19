import {Component, OnInit, OnDestroy, Input, ViewEncapsulation, ElementRef, AfterViewInit} from '@angular/core';
import {FormGroup, FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import * as marked from 'marked';
import {ChatService} from '../chat.service';
import {firstValueFrom, Observable} from 'rxjs';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {FlagService} from '../flag.service';
import {Flag} from '../models/flag';
import {Chat, ChatApi, ChatModel} from '../models/chat';
import hljs from 'highlight.js';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit{
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
  public chatApi: any | null = null;
  public chatModels: ChatModel[] | null = null;
  public activeModel: ChatModel | null = null;

  constructor(
    private sanitizer: DomSanitizer,
    private chatService: ChatService,
    private flagService: FlagService,
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef
  ) {
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
        if (userMessages.length > 0 && assistantMessages.length > 0) {
          console.log(userMessages, assistantMessages)
          await firstValueFrom(this.chatService.add_chat(userMessages, assistantMessages));
        } else {
          this.clearChat();
        }
      }

      this.clearChat()


      if (this.chat_id !== "") {
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
      setTimeout(() => {
        this.highlightCode();
      });

      this.flagService.getFlag("vanilla").subscribe((flag: Flag) => {
        this.vanillaFlag = flag.active;
      });
      this.flagService.getFlag("history").subscribe((flag: Flag) => {
        this.historyFlag = flag.active;
      });
      this.flagService.getFlag("docs").subscribe((flag: Flag) => {
        this.docsFlag = flag.active;
      });
      this.flagService.getFlag("code").subscribe((flag: Flag) => {
        this.codeFlag = flag.active;
      });

      let url = environment.port
        ? `ws://${environment.apiUrl}:${environment.port}/websocket/`
        : `ws://${environment.apiUrl}/websocket/`;
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log("WebSocket connection opened.");
      };

      this.ws.onmessage = (event: MessageEvent) => {
        if (event.data == "<ASTOR>") {
          this.isFirst = true;
          this.assistantMessages.push(this.messages);
          this.newAssistantMessages.push([this.messages, this.assistantMessages.length - 1]);
          setTimeout(() => {
            this.highlightCode();
          }, 1000); // Waits for 1 second before calling highlightCode

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

      this.chatService.getActiveChatModel().subscribe(
        (response) => {
          this.activeModel = response;
          this.selectedApi = this.activeModel!.chat_api_type;
          this.chatService.getChatApiAndModels(this.activeModel!.chat_api_type).subscribe(
            (response) => {
              this.chatApi = response["api"]
              this.chatModels = response["models"]
              console.log(this.chatApi, this.chatModels)
            },
            (error) => {
              console.error('Error fetching chats:', error);
            })
        },
      )

    });

  }

  clearChat(): void {
    localStorage.removeItem('userMessages');
    localStorage.removeItem('assistantMessages');
    localStorage.removeItem('chat_id')
  }

  ngOnDestroy(): void {
    if (this.ws) {
      this.ws.close();
    }
  }

  sendMessage(): void {
    this.sanitizedMessages = this.sanitizer.bypassSecurityTrustHtml('');
    setTimeout(() => {
      this.highlightCode();
    });

    if (this.ws && this.inputMessage.trim() !== '') {
      this.ws.send(JSON.stringify([this.inputMessage, this.userMessages, this.assistantMessages]));
      this.userMessages.push(this.inputMessage);
      this.newUserMessages.push([this.inputMessage, this.userMessages.length - 1]);
      this.isFirst = false;
      this.messages = '';
      this.inputMessage = '';
    }

    // Save chat data after sending a message
    this.saveChatData();

    // Update and apply syntax highlighting after the message is processed
  }


  updateSanitizedMessages(): void {
    const html = marked.parse(this.messages);
    if (typeof html === 'string') {
      if (html.includes("</code>")) {
        // setTimeout(() => {
        //   this.highlightCode();
        // });
      }
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

  expandFlag: boolean = false;

  expandChat(textarea: HTMLTextAreaElement) {
    console.log("expand")
    if (textarea.rows == 1) {
      textarea.rows = 10;
      this.expandFlag = true;
    } else {
      textarea.rows = 1;
      this.expandFlag = false;
    }
  }


  docsFlag: boolean = false;

  setDocsFlag() {
    this.flagService.setFlag("docs", !this.docsFlag).subscribe(
      (response) => {
        this.docsFlag = !this.docsFlag;
      },
      (error) => {
        console.error('Error:', error);
      }
    )
  }
  navigateToChat() {
    this.clearChat();
    this.router.navigate(['/chat']).then(() => {
      window.location.reload();
    });
  }
  codeFlag: boolean = false;

  setCodeFlag() {
    this.flagService.setFlag("code", !this.codeFlag).subscribe(
      (response) => {
        this.codeFlag = !this.codeFlag;
      },
      (error) => {
        console.error('Error:', error);
      }
    )
  }

  vanillaFlag: boolean = false;

  setVanillaFlag() {
    this.flagService.setFlag("vanilla", !this.vanillaFlag).subscribe(
      (response) => {
        this.vanillaFlag = !this.vanillaFlag;
      },
      (error) => {
        console.error('Error:', error);
      }
    )
  }

  historyFlag: boolean = false;

  setHistoryFlag() {
    this.flagService.setFlag("history", !this.historyFlag).subscribe(
      (response) => {
        this.historyFlag = !this.historyFlag;
      },
      (error) => {
        console.error('Error:', error);
      }
    )
  }

  handleKeyDown(event: KeyboardEvent, textarea: HTMLTextAreaElement): void {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
      } else {
        event.preventDefault();
        this.sendMessage();
      }
    }
  }

  barStatus = "close"
  initChats = false;
  chats: any | null = null


  toggleHistoryBar() {
    if (this.barStatus == "history") {
      this.barStatus = "close"
    }else{
      this.barStatus = "history"
    }

    if (!this.initChats) {
      this.chatService.getChats().subscribe(
        (chats: any) => {
          this.chats = chats;
          console.log(this.chats["today"])
        },
        (error) => {
          console.error('Error fetching chats:', error);
        })
    }
    this.initChats = true;
  }

  // chats: Chat[] | null = null


  toggleChatModels() {
    if (this.barStatus == "chat_models") {
      this.barStatus = "close"
    }else{
      this.barStatus = "chat_models"
    }
  }

  selectedApi: string = "openai"
  getModelInfo(model:string){
    this.selectedApi = model;
    this.chatService.getChatApiAndModels(model).subscribe(
      (response) => {
        this.chatApi = response["api"]
        this.chatModels = response["models"]
        console.log(this.chatApi, this.chatModels)
      },
      (error) => {
        console.error('Error fetching chats:', error);
      })
  }

  selectedInfo: string = "models"
  changeSelectedInfo(newSelected:string){
    this.selectedInfo = newSelected;
  }

  selectChat(chatId: string) {
    this.router.navigate(['/chat'], { queryParams: { chat_id: chatId } })
      .then(() => {
        // Refresh the site after navigation
        window.location.reload();
      });
  }

  isAddingModel = false; // State to track if we are adding a model
  newModelName = '';

  addChatModel() {
    this.isAddingModel = true; // Display the input field and button
  }

  confirmAddModel() {
    if (this.newModelName.trim()) {
      let chatModel = new ChatModel(this.newModelName, this.selectedApi)
      this.chatService.addChatModel(this.newModelName, this.selectedApi).subscribe(
        (response) => {
          this.chatModels?.push(chatModel);
          this.newModelName = '';
          this.isAddingModel = false;
        },
        (error) => {
          console.error('Error:', error);
        }
      )
    }
  }

  cancelAddModel() {
    this.newModelName = '';
    this.isAddingModel = false;
  }

  setActiveChatModel(model:string) {
    console.log(model, this.selectedApi)
    this.chatService.setActiveChatModel(model, this.selectedApi).subscribe(
      (response) => {
        this.activeModel = new ChatModel(model, this.selectedApi)
      }
    )
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.highlightCode();
    });
  }

  private highlightCode(): void {
    const codeBlocks = this.el.nativeElement.querySelectorAll('.assistant-card pre code');

    codeBlocks.forEach((block: HTMLElement) => {
      hljs.highlightElement(block);
    });
  }

  getChats(timePeriod: string) {
    if (this.chats != null) {
      return this.chats[timePeriod];
    }
  }
}
