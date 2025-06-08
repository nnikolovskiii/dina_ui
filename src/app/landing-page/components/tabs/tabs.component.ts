import {Component} from '@angular/core';
import {NgFor, NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [NgFor, NgIf, TranslateModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent {
  // Sets the default active tab to the first feature
  activeTab: string = 'task-automation';

  // Defines the new tabs based on your features
  tabs = [
    { label: 'LANDING_PAGE.TABS.TASK_AUTOMATION', value: 'task-automation' },
    { label: 'LANDING_PAGE.TABS.COMMUNICATION', value: 'multimodal-communication' },
    { label: 'LANDING_PAGE.TABS.REASONING', value: 'advanced-reasoning' },
    { label: 'LANDING_PAGE.TABS.UNDERSTANDING', value: 'contextual-understanding' }
  ];

  /**
   * Sets the active tab to the one provided.
   * @param tabValue The value of the tab to make active.
   */
  setActiveTab(tabValue: string): void {
    this.activeTab = tabValue;
  }
}
