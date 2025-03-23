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
import {FlagService} from '../../../show-process/services/flag/flag.service';
import {Chat, ChatApi, ChatModel} from '../../models/chat';
import {environment} from '../../../../../environments/environment';
import {HistorySidebarComponent} from '../history-sidebar/history-sidebar.component';
import {DocumentFormComponent} from '../../../dina-home/components/document-form/document-form.component';
import {PaymentComponent} from '../../../dina-home/components/payment/payment.component';
import {AppointmentListComponent} from '../../../dina-home/components/appointment-list/appointment-list.component';
import {
  AppointmentSidebarComponent
} from '../../../dina-home/components/appointment-sidebar/appointment-sidebar.component';

interface Message {
  content: string;
  type: 'user' | 'assistant';
  isStreaming: boolean;
  sanitizedContent: SafeHtml;
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
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, HistorySidebarComponent, DocumentFormComponent, PaymentComponent, AppointmentListComponent, AppointmentSidebarComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('appointmentSidebar') appointmentSidebar!: AppointmentSidebarComponent;
  @Input() chat_id: string | null = null;
  private ws: WebSocket | undefined;
  public inputMessage: string = '';
  public messages: Message[] = [];
  public chatApi: any | null = null;
  public chatModels: ChatModel[] | null = null;
  public activeModel: ChatModel | null = null;
  public isStreaming = false;
  public lightMode: boolean = false;

  constructor(
    private sanitizer: DomSanitizer,
    private chatService: ChatService,
    private flagService: FlagService,
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef,
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(async (params) => {
      this.chat_id = params['chat_id'] || null;

      if (this.chat_id) {
        this.loadExistingMessages();
      } else {
        this.addDummyStreamingMessage()

      }

      this.initializeWebSocket();
      this.initializeChatModels();
      this.updateTheme()
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

  barStatus = "close"

  toggleHistoryBar() {
    if (this.barStatus == "history") {
      this.barStatus = "close"
    } else {
      this.barStatus = "history"
    }

  }


  toggleChatModels() {
    if (this.barStatus == "chat_models") {
      this.appointmentSidebar.refreshAppointments();
      this.barStatus = "close"
    } else {
      this.appointmentSidebar.refreshAppointments();
      this.barStatus = "chat_models"
    }


  }

  selectedApi: string = "openai"


  ngAfterViewInit(): void {
    setTimeout(() => {
    }, 500);
  }


  private scrollToBottom(): void {
    const messagesContainer = this.el.nativeElement.querySelector('.messages');
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

  sendMessage(): void {
    this.showForm = false;
    this.showAppointments = false;

    if (!this.inputMessage.trim()) return;

    this.messages.push(this.createMessage('user', this.inputMessage));

    this.messages.push({
      content: '',
      type: 'assistant',
      isStreaming: true,
      sanitizedContent: this.sanitizer.bypassSecurityTrustHtml('')
    });


    if (this.ws) {
      let websocketData = new WebsocketData("chat", [this.inputMessage, this.chat_id])
      this.ws.send(JSON.stringify(websocketData));
    }

    this.inputMessage = '';
    this.cdRef.detectChanges();
    this.autoResize();
  }

  private createMessage(type: 'user' | 'assistant', content: string, isStreaming = false) {
    return {
      content,
      type,
      isStreaming,
      sanitizedContent: this.sanitizer.bypassSecurityTrustHtml(<string>marked.parse(content))
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
      const wsData: WebsocketData = JSON.parse(event.data);
      if (wsData.data_type != "stream" && wsData.data != "no_stream") {
        this.actions = wsData.actions!;
        this.next_action = wsData.next_action!;
      }

      if (wsData.data_type === "stream") {
        let data_m = wsData.data;

        if (data_m.includes("<ASTOR>")) {
          this.chat_id = data_m.split(":")[1]
          this.finalizeCurrentMessage();
        } else {
          this.updateStreamingMessage(data_m);
        }
      } else if (wsData.data_type === "form") {
        this.dataType = "form"

        this.interceptType = wsData.intercept_type!;
        let formData = new FormServiceData();
        Object.assign(formData, wsData.data);

        this.formData = formData

        if (this.interceptType == "document_data" || this.interceptType == "appointment_data") {
          this.showForm = true;
        } else if (this.interceptType == "payment_data") {
          this.messages.pop()
          this.payment = true;
        } else if (this.interceptType == "show_appointments") {
          this.showAppointments = true;
        }
      } else if (wsData.data_type === "list") {
        this.dataType = "list"

        this.showAppointments = true;
      } else if (wsData.data_type === "form1") {
        this.dataType = "form1"
        console.log(this.dataType)

        this.interceptType = wsData.intercept_type!;
        let formData = new FormServiceData();
        Object.assign(formData, wsData.data);

        this.formData = formData

        this.showForm = true;

      } else if (wsData.data_type === "no_stream") {
        this.messages.pop()
        this.messages.push({
          content: wsData.data,
          type: 'assistant',
          isStreaming: true,
          sanitizedContent: this.sanitizer.bypassSecurityTrustHtml('')
        });
        this.finalizeCurrentMessage();
      } else if (wsData.data_type === "payment") {
        this.payment = true;
      }
    };

  }


  private loadExistingMessages(): void {
    this.chatService.get_chat_messages(this.chat_id ?? "").subscribe(response => {
      const userMessages = response["user_messages"];
      const assistantMessages = response["assistant_messages"];

      console.log(userMessages, assistantMessages)

      this.messages = [];
      for (let i = 0; i < userMessages.length; i++) {
        this.messages.push(this.createMessage('user', userMessages[i].content));
        if (i < assistantMessages.length) {
          this.messages.push(this.createMessage('assistant', assistantMessages[i].content));
        }
      }


    });
  }


  handleGenerate(formData: any) {
    if (this.ws) {
      let websocketData = new WebsocketData(this.dataType!, [this.formData, this.chat_id], this.interceptType!, this.actions!, this.next_action!)
      this.ws.send(JSON.stringify(websocketData));
      this.showForm = false;
      this.payment = false;
      this.messages.push({
        content: '',
        type: 'assistant',
        isStreaming: true,
        sanitizedContent: this.sanitizer.bypassSecurityTrustHtml('')
      });
    }
  }

  addDummyStreamingMessage() {
    const fullMessage = 'Здраво, јас сум Дина! Како можам да ти помогнам денес?';
    const words = fullMessage.split(' ');
3
    // Initial empty message with streaming state
    this.messages.push({
      content: '',
      type: 'assistant',
      isStreaming: true,
      sanitizedContent: this.sanitizer.bypassSecurityTrustHtml("")
    });

    // Add initial delay before starting
    setTimeout(() => {
      words.forEach((word, index) => {
        setTimeout(() => {
          const lastIndex = this.messages.length - 1;
          const currentMessage = this.messages[lastIndex].content + (index > 0 ? ' ' : '') + word;

          this.messages[lastIndex] = {
            content: currentMessage,
            type: 'assistant',
            isStreaming: index < words.length - 1,
            sanitizedContent: this.sanitizer.bypassSecurityTrustHtml(
              <string>marked.parse(currentMessage)
            )
          };

          this.cdRef.detectChanges();
          this.scrollToBottom();

          if (index === words.length - 1) {
            this.finalizeCurrentMessage();
          }
        }, 100 * index); // 1 second per word
      });
    }, 1000); // Initial 1-second delay
  }


  @ViewChild('messageArea') messageArea!: ElementRef<HTMLTextAreaElement>;

  @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLDivElement>;
  basePadding = 0; // Base padding below textarea in pixels

  autoResize() {
    const textarea = this.messageArea.nativeElement;
    const maxHeight = 150;

    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);

    // Set textarea height
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = newHeight >= maxHeight ? 'auto' : 'hidden';

    // Update messages container padding
    if (this.messagesContainer) {
      const totalPadding = newHeight + this.basePadding;
      this.messagesContainer.nativeElement.style.paddingBottom = `${totalPadding}px`;
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

}
