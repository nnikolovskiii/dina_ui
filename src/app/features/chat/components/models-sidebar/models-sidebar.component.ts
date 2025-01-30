import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {ChatModel} from '../../models/chat';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-models-sidebar',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './models-sidebar.component.html',
  styleUrl: './models-sidebar.component.css'
})
export class ModelsSidebarComponent implements OnInit {
  @Output() toggleRequested = new EventEmitter<void>();
  public chatApi: any | null = null;
  public chatModels: ChatModel[] | null = null;
  public activeModel: ChatModel | null = null;
  public barStatus = "chat_models"
  public selectedApi: string = "openai"
  public selectedInfo: string = "models"
  public isAddingModel = false;
  public newModelName = '';



  constructor(
    private chatService: ChatService,
    private cdRef: ChangeDetectorRef
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.initializeChatModels();
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
          }
        );
      },
    );
  }

  toggleChatModels() {
    this.toggleRequested.emit();
  }


  getModelInfo(model: string) {
    this.selectedApi = model;
    this.chatService.getChatApiAndModels(model).subscribe(
      (response) => {
        this.chatApi = response["api"]
        this.chatModels = response["models"]
        console.log(this.chatApi, this.chatModels)
      })
  }
  changeSelectedInfo(newSelected: string) {
    this.selectedInfo = newSelected;
  }


  addChatModel() {
    this.isAddingModel = true;
  }

  confirmAddModel() {
    if (this.newModelName.trim()) {
      let chatModel = new ChatModel(this.newModelName, this.selectedApi)
      this.chatService.addChatModel(this.newModelName, this.selectedApi).subscribe(
        () => {
          this.chatModels?.push(chatModel);
          this.newModelName = '';
          this.isAddingModel = false;
        },
      )
    }
  }

  cancelAddModel() {
    this.newModelName = '';
    this.isAddingModel = false;
  }

  setActiveChatModel(model: string) {
    console.log(model, this.selectedApi)
    this.chatService.setActiveChatModel(model, this.selectedApi).subscribe(
      () => {
        this.activeModel = new ChatModel(model, this.selectedApi)
      }
    )
  }
}

