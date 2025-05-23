// assistant-message.component.ts
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { SafeHtml } from '@angular/platform-browser';
import {SuggestedQuestionsComponent} from '../suggested-questions/suggested-questions.component';
import {MessageMetadataComponent} from '../message-metadata/message-metadata.component';

// Define the Message interface (or import it if it's in a shared file)
// This should match the Message interface in RChatComponent
interface Message {
  content: string;
  type: 'user' | 'assistant';
  isStreaming: boolean;
  sanitizedContent: SafeHtml;
  timestamp: string;
}

@Component({
  selector: 'app-assistant-message',
  standalone: true,
  imports: [CommonModule, SuggestedQuestionsComponent, MessageMetadataComponent], // Add CommonModule for *ngIf, [innerHtml] etc.
  templateUrl: './assistant-message.component.html',
  styleUrls: ['./assistant-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // Optional: for performance, if parent updates immutably
})
export class AssistantMessageComponent {
  @Input() message!: Message; // The entire message object
  @Input() showLogo: boolean = false; // To control logo visibility
  @Input() logoUrl: string = '../../../../../assets/remora-no-bg.png'; // Default logo, can be overridden by parent
  @Input() regenerateButtonText: string = 'генерирај одново'; // Keep as is or make dynamic

  @Output() regenerate: EventEmitter<Message> = new EventEmitter<Message>();

  // Removed hardcoded mainText and original logoUrl, as they come from inputs now

  onRegenerateClick() {
    console.log('Regenerate clicked for message in AssistantMessageComponent');
    this.regenerate.emit(this.message); // Emit the message object to be regenerated
  }
}
