import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  private ws: WebSocket | undefined;
  public messages: string = '';  // Change to a single string
  public messageText: string = '';

  ngOnInit(): void {
    this.ws = new WebSocket("ws://localhost:5000/websocket/");

    this.ws.onopen = () => {
      console.log("WebSocket connection opened.");
    };

    this.ws.onmessage = (event: MessageEvent) => {
      console.log("Message received:", event.data);
      // Concatenate the new message to the existing messages
      this.messages += event.data + " "; // Add a space for separation
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
    event.preventDefault();

    if (this.ws && this.messageText.trim() !== '') {
      this.ws.send(this.messageText);
      this.messageText = '';
    }
  }
}
