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
import {environment} from '../../../../../environments/environment';
import {HistorySidebarComponent} from '../history-sidebar/history-sidebar.component';
import {DocumentFormComponent} from '../../../dina-home/components/document-form/document-form.component';
import {PaymentComponent} from '../../../dina-home/components/payment/payment.component';
import {AppointmentListComponent} from '../../../dina-home/components/appointment-list/appointment-list.component';
import {
  AppointmentSidebarComponent
} from '../../../dina-home/components/appointment-sidebar/appointment-sidebar.component';
import {AuthService} from '../../../auth/services/auth/auth.service';

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
  public isStreaming = false;
  public lightMode: boolean = false;
  public isLoggedIn: boolean = false;

  // Add a property to track whether user info is available
  public hasUserInfoAvailable: boolean = false;


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
    this.checkAuthStatus();
    this.checkUserInfo(); // Add this line to check user info

    this.route.queryParams.subscribe(async (params) => {
      this.chat_id = params['chat_id'] || null;

      if (this.chat_id) {
        this.loadExistingMessages();
      } else {
        this.addDummyStreamingMessage()
      }

      this.initializeWebSocket();
      this.updateTheme()
      this.startPlaceholderRotation();
    });

  }

  // Add this new method
  private checkUserInfo(): void {
    this.authService.hasUserInfo().subscribe(
      (hasInfo) => {
        // User has info
        this.hasUserInfoAvailable = hasInfo;
      },
      (error) => {
        // Error occurred, treat as not having info
        this.hasUserInfoAvailable = false;
      }
    );
  }


  private checkAuthStatus(): void {
    this.authService.getProtectedData().subscribe(
      (data) => {
        // User is authenticated
        this.isLoggedIn = true;
      },
      (error) => {
        // User is not authenticated
        this.isLoggedIn = false;
      }
    );
  }


  private placeholderTexts: string[] = [
    "Kако можам да извадам пасош?",
    "Закажи ми термин за лична карта.",
    "Извади ми документ за извод на родени.",
    "Покажи ми ги сите мои закажани термини.",
  ];
  currentPlaceholderIndex: number = 0;
  placeholderText: string = this.placeholderTexts[0];
  placeholderInterval: any;


  private startPlaceholderRotation(): void {
    this.placeholderInterval = setInterval(() => {
      this.currentPlaceholderIndex = (this.currentPlaceholderIndex + 1) % this.placeholderTexts.length;
      this.placeholderText = this.placeholderTexts[this.currentPlaceholderIndex];
      this.cdRef.detectChanges(); // Trigger change detection
    }, 3000); // Change every 3 seconds
  }



  ngOnDestroy(): void {
    if (this.ws) {
      this.ws.close();
    }

    if (this.placeholderInterval) {
      clearInterval(this.placeholderInterval);
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

  startLoading: boolean = false

  sendMessage(): void {
    this.showForm = false;
    this.showAppointments = false;
    this.startLoading = true;

    let messageToSend = this.inputMessage.trim();

    // If no message was typed, use the current placeholder
    if (!messageToSend) {
      messageToSend = this.placeholderText;
    }

    console.log(messageToSend);
    if (!messageToSend) return; // This should never happen now

    this.messages.push(this.createMessage('user', messageToSend));

    if (this.ws) {
      let websocketData = new WebsocketData("chat", [messageToSend, this.chat_id])
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
      `wss://${environment.apiUrl}:${environment.port}/websocket/` :
      `wss://${environment.apiUrl}/websocket/`;

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
          this.messages.push({
            content: '',
            type: 'assistant',
            isStreaming: true,
            sanitizedContent: this.sanitizer.bypassSecurityTrustHtml('')
          });
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
          this.payment = true;
        } else if (this.interceptType == "show_appointments") {
          this.showAppointments = true;
        }
      } else if (wsData.data_type === "list") {
        this.dataType = "list"

        this.showAppointments = true;
      } else if (wsData.data_type === "payment") {
        this.payment = true;
      } else if (wsData.data_type === "echo") {
        this.showForm = false;
        this.showAppointments = false;
        this.startLoading = true;

        if (this.ws) {
          let websocketData = new WebsocketData("chat", [wsData.data, this.chat_id])
          this.ws.send(JSON.stringify(websocketData));
        }

        this.cdRef.detectChanges();
        this.autoResize();
      } else if (wsData.data_type === "echo_form") {
        this.dataType = "form"
        console.log("Send echooo!")
        this.interceptType = wsData.intercept_type!;
        let formData = new FormServiceData();
        Object.assign(formData, wsData.data);
        this.formData = formData

        let websocketData = new WebsocketData(this.dataType!, [this.formData, this.chat_id], this.interceptType!, this.actions!, this.next_action!)
        this.ws!.send(JSON.stringify(websocketData));
        this.showForm = false;
        this.payment = false;
        this.startLoading = true;
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
    }

    this.startLoading = true;
  }

  addDummyStreamingMessage() {
    const fullMessage = 'Здраво, јас сум Дина! Како можам да ти помогнам денес?';
    const words = fullMessage.split(' ');

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

  shouldShowLogo(index: number): boolean {
    // First message always shows logo
    if (index === 0) return true;

    const previousMessage = this.messages[index - 1];
    const currentMessage = this.messages[index];

    // Show logo if previous message was different type
    return previousMessage.type !== currentMessage.type;
  }

  shouldShowGap(index: number): boolean {
    // No gap after last message
    if (index === this.messages.length - 1) return false;

    const current = this.messages[index];
    const next = this.messages[index + 1];

    // Only show gap if messages are different types
    return current.type !== next.type;
  }

}
