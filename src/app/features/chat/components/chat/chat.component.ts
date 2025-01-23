import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewEncapsulation,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import {FormGroup, FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import * as marked from 'marked';
import {ChatService} from '../../services/chat.service';
import {firstValueFrom, Observable} from 'rxjs';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {FlagService} from '../../../show-process/services/flag/flag.service';
import {Flag} from '../../../show-process/models/flag';
import {Chat, ChatApi, ChatModel} from '../../models/chat';
import hljs from 'highlight.js';
import {environment} from '../../../../../environments/environment';

interface Message {
  content: string;
  type: 'user' | 'assistant';
  isStreaming: boolean;
  sanitizedContent: SafeHtml;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit{
  @Input() chat_id: string | null = null;
  private ws: WebSocket | undefined;
  public inputMessage: string = '';
  public messages: Message[] = [];
  public chatApi: any | null = null;
  public chatModels: ChatModel[] | null = null;
  public activeModel: ChatModel | null = null;
  public isStreaming = false;

  constructor(
    private sanitizer: DomSanitizer,
    private chatService: ChatService,
    private flagService: FlagService,
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef,
    private cdRef: ChangeDetectorRef
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(async (params) => {
      this.chat_id = params['chat_id'] || null;

      if (this.chat_id) {
        this.loadExistingMessages();
      }

      this.initializeFlags();

      this.initializeWebSocket();
      this.initializeChatModels();

    });

  }

  private initializeFlags(): void {
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
  }

  private initializeChatModels(): void {
    this.chatService.getActiveChatModel().subscribe(
      (response) => {
        this.activeModel = response;
        this.selectedApi = this.activeModel!.chat_api_type;
        this.chatService.getChatApiAndModels(this.activeModel!.chat_api_type).subscribe(
          (response) => {
            this.chatApi = response["api"];
            this.chatModels = response["models"];
            this.cdRef.detectChanges();
          },
          (error) => {
            console.error('Error fetching chats:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching active model:', error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.ws) {
      this.ws.close();
    }
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
      this.addCopyButtons(this.el.nativeElement); // Add this line
    }, 500);
  }


  private scrollToBottom(): void {
    const messagesContainer = this.el.nativeElement.querySelector('.messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  getChats(timePeriod: string) {
    if (this.chats != null) {
      return this.chats[timePeriod];
    }
  }
  private finalizeCurrentMessage(): void {
    const lastMessage = this.messages[this.messages.length - 1];
    if (lastMessage.type === 'assistant') {
      lastMessage.isStreaming = false;
      lastMessage.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(
        <string>marked.parse(lastMessage.content)
      );

      // Add copy buttons after slight delay
      setTimeout(() => {
        this.addCopyButtonsToLatestMessage();
      }, 100);
    }
  }


  private updateStreamingMessage(chunk: string): void {
    this.isStreaming = true;
    const lastMessage = this.messages[this.messages.length - 1];
    if (lastMessage.type === 'assistant' && lastMessage.isStreaming) {
      lastMessage.content += chunk;
      lastMessage.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(
        <string>marked.parse(lastMessage.content)
      );

      // Force DOM update and highlight immediately
      this.cdRef.detectChanges();
      this.highlightCode();

      // Auto-scroll to bottom
      this.scrollToBottom();
    }
  }

  sendMessage(): void {
    if (!this.inputMessage.trim()) return;

    // Add user message
    this.messages.push(this.createMessage('user', this.inputMessage));

    // Add temporary assistant message
    this.messages.push({
      content: '',
      type: 'assistant',
      isStreaming: true,
      sanitizedContent: this.sanitizer.bypassSecurityTrustHtml('')
    });

    if (this.ws) {
      this.ws.send(JSON.stringify([this.inputMessage, this.chat_id]));
    }

    this.inputMessage = '';
    this.cdRef.detectChanges();
  }

  private createMessage(type: 'user' | 'assistant', content: string, isStreaming = false) {
    return {
      content,
      type,
      isStreaming,
      sanitizedContent: this.sanitizer.bypassSecurityTrustHtml(<string>marked.parse(content))
    };
  }

  private initializeWebSocket(): void {
    const url = environment.port ?
      `ws://${environment.apiUrl}:${environment.port}/websocket/` :
      `ws://${environment.apiUrl}/websocket/`;

    this.ws = new WebSocket(url);

    this.ws.onmessage = (event: MessageEvent) => {
      if (event.data === "<ASTOR>") {
        this.finalizeCurrentMessage();
      } else {
        this.updateStreamingMessage(event.data);
      }
    };

    // Keep other WebSocket handlers (onopen, onerror, onclose)
    // ...
  }


  private loadExistingMessages(): void {
    this.chatService.get_chat_messages(this.chat_id ?? "").subscribe(response => {
      const userMessages = response["user_messages"];
      const assistantMessages = response["assistant_messages"];

      this.messages = [];
      for (let i = 0; i < userMessages.length; i++) {
        this.messages.push(this.createMessage('user', userMessages[i].content));
        if (i < assistantMessages.length) {
          this.messages.push(this.createMessage('assistant', assistantMessages[i].content));
        }
      }

      // Delay highlighting until after view updates
      setTimeout(() => {
        this.highlightCode();
      });

      setTimeout(() => this.addCopyButtons(this.el.nativeElement), 200);
    });
  }

// Add to your component class
  // Update addCopyButtons method
  private addCopyButtons(container: HTMLElement): void {
    const codeContainers = container.querySelectorAll('pre');
    codeContainers.forEach((preElement: HTMLElement) => {
      if (!preElement.querySelector('.copy-btn')) {
        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.innerHTML = '📋';
        btn.title = 'Copy to clipboard';

        // Force show button temporarily for initialization
        btn.style.opacity = '1';
        btn.style.transform = 'translateY(0)';

        setTimeout(() => {
          btn.style.opacity = '';
          btn.style.transform = '';
        }, 100);

        btn.addEventListener('click', () => this.copyCode(preElement));
        preElement.appendChild(btn);
      }
    });
  }
  private addCopyButtonsToLatestMessage(): void {
    const messages = this.el.nativeElement.querySelectorAll('.assistant-card');
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
      this.addCopyButtons(lastMessage);
    }
  }


  private copyCode(container: HTMLElement): void {
    const code = container.querySelector('code')?.textContent || '';
    navigator.clipboard.writeText(code).then(() => {
      // Optional: Show feedback
      const btn = container.querySelector('.copy-btn') as HTMLElement;
      if (btn) {
        btn.textContent = '✓';
        setTimeout(() => btn.textContent = '📋', 2000);
      }
    });
  }

// Update highlightCode()
  private highlightCode(): void {
    requestAnimationFrame(() => {
      const codeBlocks = this.el.nativeElement.querySelectorAll('pre code');
      codeBlocks.forEach((block: HTMLElement) => {
        if (!block.classList.contains('hljs')) {
          hljs.highlightElement(block);
        }
      });
    });
  }

}
