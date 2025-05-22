import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewEncapsulation,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef, ViewChild, Renderer2, Inject
} from '@angular/core';
import {FormGroup, FormsModule} from '@angular/forms';
import {CommonModule, DOCUMENT} from '@angular/common';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import * as marked from 'marked';
import {ChatService} from '../../services/chat.service';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {HistorySidebarComponent} from '../history-sidebar/history-sidebar.component';
import {AuthService} from '../../../auth/services/auth/auth.service';
import {LogoTitleComponent} from '../../../logo-title/logo-title.component';
import {UserMessage} from '../user-message/user-message';
import {AssistantMessageComponent} from '../assistant-message/assistant-message.component';

interface Message {
  content: string;
  type: 'user' | 'assistant';
  isStreaming: boolean;
  sanitizedContent: SafeHtml;
  timestamp: string; // Added timestamp
}

export class WebsocketData {
  data_type: string;
  data: any;
  intercept_type?: string | null;
  actions: string[];
  next_action: number;

  constructor(
    data_type: string,
    data: any,
    intercept_type?: string,
    actions: string[] = [],
    next_action: number = 0
  ) {
    this.data_type = data_type;
    this.data = data;
    this.intercept_type = intercept_type;
    this.actions = actions;
    this.next_action = next_action;
  }
}

export class FormData {
  form_id?: string;
  form_data?: any;
}

export enum FormServiceStatus {
  HAS_APPOINTMENT = "has_appointment",
  HAS_DOCUMENT = "has_document",
  NO_SERVICE = "no_service",
  HAS_NOTHING = "has_nothing",
  NO_INFO = "no_info",
  INFO = "info"
}

export class FormServiceData extends FormData {
  service_type?: string;
  service_name?: string;
  download_link?: string;
  status?: FormServiceStatus;
  status_message?: string;
}


@Component({
  selector: 'app-real-chat',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, HistorySidebarComponent, UserMessage, AssistantMessageComponent],
  templateUrl: './r-chat.component.html',
  styleUrls: ['./r-chat.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RChatComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() chat_id: string | null = null;
  private ws: WebSocket | undefined;
  public inputMessage: string = '';
  public messages: Message[] = [];
  public isStreaming = false;
  public lightMode: boolean = false;
  public isLoggedIn: boolean = true;

  public hasUserInfoAvailable: boolean = true;


  constructor(
    private sanitizer: DomSanitizer,
    private chatService: ChatService,
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef,
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private authService: AuthService,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(async (params) => {
      this.chat_id = params['chat_id'] || null;

      if (this.chat_id) {
        this.loadExistingMessages();
      } else {
        this.addDummyUserMessage();
        this.addDummyStreamingMessage();
      }

      this.initializeWebSocket();
      this.updateTheme();
    });
  }

  private addDummyUserMessage() {
    const dummyUserMessage = 'Здраво, се мислам да земам Каско осигурување за мојот велосипед. Сакам да знам, доколку велосипедот ми биде украден додека е оставен заклучен пред кафуле, дали Каско осигурувањето ќе ја покрие штетата?';
    this.messages.push(this.createMessage('user', dummyUserMessage));
  }

  ngOnDestroy(): void {
    if (this.ws) {
      this.ws.close();
    }
  }

  expandFlag: boolean = false;

  expandChat(textarea: HTMLTextAreaElement) {
    if (textarea.rows == 1) {
      textarea.rows = 10;
      this.expandFlag = true;
    } else {
      textarea.rows = 1;
      this.expandFlag = false;
    }
  }

  navigateToChat() {
    this.router.navigate(['/chat']).then(() => {
      window.location.reload();
    });
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

  public handleRegenerateMessage(messageToRegenerate: Message): void {
    console.log('Regenerate requested in RChatComponent for:', messageToRegenerate);

    // Find the last user message before this assistant message
    let previousUserMessageContent: string | null = null;
    const assistantMessageIndex = this.messages.indexOf(messageToRegenerate);

    if (assistantMessageIndex > -1) {
      for (let i = assistantMessageIndex - 1; i >= 0; i--) {
        if (this.messages[i].type === 'user') {
          previousUserMessageContent = this.messages[i].content;
          break;
        }
      }
    }

    if (previousUserMessageContent) {
      // Remove the assistant message that needs regeneration
      // and any subsequent messages if they depend on it (optional, depends on logic)
      this.messages.splice(assistantMessageIndex); // Removes from assistantMessageIndex to the end
                                                   // Or just this.messages = this.messages.filter(m => m !== messageToRegenerate);
                                                   // if only that specific message should be removed.
                                                   // Be careful if there are other assistant messages after it.

      // Resend the previous user message
      this.showForm = false;
      this.showAppointments = false;
      this.startLoading = true;

      // Add the user message back to the display list immediately
      // Or let sendMessage handle it if it adds user message before sending to WS
      // this.messages.push(this.createMessage('user', previousUserMessageContent));

      if (this.ws) {
        // Send the original user query that led to the message being regenerated
        let websocketData = new WebsocketData("real-chat", [previousUserMessageContent, this.chat_id]);
        this.ws.send(JSON.stringify(websocketData));
      }
      // No need to set this.inputMessage, as we are resending an old message
      this.cdRef.detectChanges();
      this.autoResize(); // If input area changes
      this.scrollToBottom();
    } else {
      console.warn("Could not find a previous user message to regenerate from.");
      // Optionally, you could send a specific "regenerate" command to the backend
      // with the ID of the message to regenerate, if your backend supports that.
      // e.g., this.ws.send(JSON.stringify(new WebsocketData("regenerate_message", { message_id: messageToRegenerate.id /* if messages have IDs */, chat_id: this.chat_id })));
    }
  }

  barStatus = "close"

  toggleHistoryBar() {
    if (this.barStatus == "history") {
      this.barStatus = "close"
    } else {
      this.barStatus = "history"
    }
  }

  selectedApi: string = "openai"

  ngAfterViewInit(): void {
    setTimeout(() => {
    }, 500);
  }

  private scrollToBottom(): void {
    const messagesContainer = this.el.nativeElement.querySelector('.messages-scroll-container'); // Adjusted selector
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  private finalizeCurrentMessage(): void {
    const lastMessage = this.messages[this.messages.length - 1];
    if (lastMessage.type === 'assistant') {
      lastMessage.isStreaming = false;
      lastMessage.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(
        <string>marked.parse(lastMessage.content)
      );
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
      this.cdRef.detectChanges();
      this.scrollToBottom();
    }
  }

  startLoading: boolean = false

  sendMessage(): void {
    this.showForm = false;
    this.showAppointments = false;
    this.startLoading = true;

    let messageToSend = this.inputMessage.trim();
    if (!messageToSend) return;

    this.messages.push(this.createMessage('user', messageToSend));

    if (this.ws) {
      let websocketData = new WebsocketData("real-chat", [messageToSend, this.chat_id])
      this.ws.send(JSON.stringify(websocketData));
    }

    this.inputMessage = '';
    this.cdRef.detectChanges();
    this.autoResize();
  }

  private createMessage(type: 'user' | 'assistant', content: string, isStreaming = false): Message {
    const now = new Date();
    // Hardcoded example: "11/21/2023, 10:30 AM"
    // You can format this as you like.
    const timestamp = `${now.toLocaleDateString()}, ${now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
    return {
      content,
      type,
      isStreaming,
      sanitizedContent: this.sanitizer.bypassSecurityTrustHtml(<string>marked.parse(content)),
      timestamp
    };
  }

  showForm: boolean = false
  payment: boolean = false
  formData: FormServiceData | null = null;
  actions: string[] | null = null;
  next_action: number | null = null;
  dataType: string | null = null;
  interceptType: string | null = null
  showAppointments: boolean = false

  private initializeWebSocket(): void {
    const url = environment.port ?
      `ws://${environment.apiUrl}:${environment.port}/websocket/` :
      `ws://${environment.apiUrl}/websocket/`;

    this.ws = new WebSocket(url);

    this.ws.onmessage = (event: MessageEvent) => {
      this.startLoading = false;
      const wsData: WebsocketData = JSON.parse(event.data);
      console.log(wsData)
      if (wsData.data_type != "stream" && wsData.data != "no_stream") {
        this.actions = wsData.actions!;
        this.next_action = wsData.next_action!;
      }

      if (wsData.data_type === "stream") {
        let data_m = wsData.data;

        if (data_m.includes("<ASTOR>")) {
          this.chat_id = data_m.split(":")[1]
          this.finalizeCurrentMessage();
        } else if (data_m.includes("<KASTOR>")) {
          // Create the initial assistant message structure, createMessage will add a timestamp
          const assistantMessageShell = this.createMessage('assistant', '', true);
          this.messages.push(assistantMessageShell);
        } else {
          this.updateStreamingMessage(data_m);
        }
      }
    };
  }

  private loadExistingMessages(): void {
    this.chatService.get_chat_messages(this.chat_id ?? "").subscribe(response => {
      const userMessages = response["user_messages"];
      const assistantMessages = response["assistant_messages"];
      this.messages = [];
      for (let i = 0; i < userMessages.length; i++) {
        // createMessage will add a timestamp (current time for loaded messages)
        this.messages.push(this.createMessage('user', userMessages[i].content));
        if (i < assistantMessages.length) {
          this.messages.push(this.createMessage('assistant', assistantMessages[i].content));
        }
      }
      this.cdRef.detectChanges();
      this.scrollToBottom();
    });
  }


  addDummyStreamingMessage() {
    const fullMessage = '## Ограничување на покритието за кражба кај Каско осигурување на велосипед од Сава Осигурување\n' +
      '\n' +
      'Според **Општите услови за Каско осигурување на велосипед** на Сава Осигурување, покритието за ризикот **кражба** има специфично ограничување кое е клучно за разбирање на обемот на осигурувањето.\n' +
      '\n' +
      'Во **Член 3, став (1), точка 3** од условите е експлицитно наведено:\n' +
      '\n' +
      '> "Каско осигурувањето на велосипедот важи на територија на Р. С. Македонија, освен ризикот кражба кој што важи само на адресата наведена на полисата за осигурување."\n' +
      '\n' +
      'Ова значи дека:\n' +
      '\n' +
      '* **Покритието за кражба е ограничено само на адресата која е наведена во вашата полиса за осигурување.** Оваа адреса најчесто е адресата на вашето живеење.\n' +
      '* **Доколку велосипедот биде украден на друга локација, на пример, додека е оставен заклучен пред кафуле, Каско осигурувањето најверојатно нема да ја покрие штетата.**\n' +
      '\n' +
      'Дополнително, **Член 18, став (1), точка 5** ги дефинира условите под кои се покрива **„Провална кражба“**. Овие услови главно се однесуваат на ситуации кога кражбата е извршена со провалување во заклучени простории на станбен објект каде што се наоѓа велосипедот.\n' +
      '\n' +
      '**Заклучок:**\n' +
      '\n' +
      'Во случај на кражба на велосипед пред кафуле, дури и ако бил заклучен, Каско осигурувањето од Сава Осигурување, според приложените услови, **најверојатно нема да го покрие тој ризик**.\n' +
      '\n' +
      '**Препорака:**\n' +
      '\n' +
      'За да бидете сигурни во обемот на вашето покритие, **внимателно проверете ја вашата полиса за осигурување** за точната адреса наведена за покритие од кражба.';
    const words = fullMessage.split(' ');

    // Create initial message shell with timestamp
    const initialAssistantMessage = this.createMessage('assistant', '', true);
    this.messages.push(initialAssistantMessage);

    setTimeout(() => {
      words.forEach((word, index) => {
        setTimeout(() => {
          const lastIndex = this.messages.length - 1;
          const currentMessageContent = this.messages[lastIndex].content + (index > 0 ? ' ' : '') + word;

          this.messages[lastIndex] = {
            ...this.messages[lastIndex], // Preserve timestamp and type
            content: currentMessageContent,
            isStreaming: index < words.length - 1,
            sanitizedContent: this.sanitizer.bypassSecurityTrustHtml(
              <string>marked.parse(currentMessageContent)
            )
          };

          this.cdRef.detectChanges();
          this.scrollToBottom();

          if (index === words.length - 1) {
            this.finalizeCurrentMessage();
          }
        }, 100 * index);
      });
    }, 1000);
  }

  @ViewChild('messageArea') messageArea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLDivElement>;
  basePadding = 0;

  autoResize() {
    const textarea = this.messageArea.nativeElement;
    const maxHeight = 150;
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = newHeight >= maxHeight ? 'auto' : 'hidden';
    if (this.messagesContainer) {
      const totalPadding = newHeight + this.basePadding;
      // This padding adjustment on messagesContainer seems to be for the input box area,
      // keeping it as is.
      // this.messagesContainer.nativeElement.style.paddingBottom = `${totalPadding}px`;
    }
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

  shouldShowLogo(index: number): boolean {
    if (index === 0 && this.messages[index].type === 'assistant') return true;
    if (index > 0) {
      const previousMessage = this.messages[index - 1];
      const currentMessage = this.messages[index];
      return currentMessage.type === 'assistant' && previousMessage.type !== currentMessage.type;
    }
    return false;
  }

  shouldShowGap(index: number): boolean {
    if (index === this.messages.length - 1) return false;
    const current = this.messages[index];
    const next = this.messages[index + 1];
    return current.type !== next.type;
  }
}
