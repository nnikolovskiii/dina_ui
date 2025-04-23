import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-no-cost-section',
  standalone: true,
  imports: [],
  templateUrl: './no-cost-section.component.html',
  styleUrl: './no-cost-section.component.css'
})
export class NoCostSectionComponent {
  @Input() title: string = "Watch Remora in Action";
  @Input() description: string = "This is where the magic happens. Remora's AI doesn't just reply—it understands context, taps into its toolkit, and gets things done. Need data analyzed? A task automated? Apps connected? Just ask. Watch how seamlessly it adapts to your workflow.";
  @Input() buttonText: string = "Try the chat";
  @Input() secondButtonText: string = "Learn more";
  @Input() cardColor: string = "#5806da"; // Controls accent color
}
