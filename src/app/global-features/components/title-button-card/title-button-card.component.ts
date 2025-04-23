import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-title-button-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title-button-card.component.html',
  styleUrl: './title-button-card.component.css'
})
export class TitleButtonCardComponent {
  @Input() title: string = "Watch Remora in Action";
  @Input() description: string = "This is where the magic happens. Remora's AI doesn't just reply—it understands context, taps into its toolkit, and gets things done. Need data analyzed? A task automated? Apps connected? Just ask. Watch how seamlessly it adapts to your workflow.";
  @Input() buttonText: string = "Try the chat";
  @Input() secondButtonText: string = "Learn more";
  @Input() cardColor: string = "#00e9f5"; // Controls accent color
  @Input() width: string = "600px"; // New width input with default value
}
