import {Component} from '@angular/core';
import {NgFor, NgIf} from '@angular/common';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent {
  // Sets the default active tab to the first feature
  activeTab: string = 'task-automation';

  // Defines the new tabs based on your features
  tabs = [
    { label: 'Task Automation', value: 'task-automation' },
    { label: 'Communication', value: 'multimodal-communication' },
    { label: 'Reasoning', value: 'advanced-reasoning' },
    { label: 'Understanding', value: 'contextual-understanding' }
  ];

  /**
   * Sets the active tab to the one provided.
   * @param tabValue The value of the tab to make active.
   */
  setActiveTab(tabValue: string): void {
    this.activeTab = tabValue;
  }
}
