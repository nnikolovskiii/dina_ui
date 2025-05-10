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
  activeTab: string = 'featured';

  tabs = [
    {label: 'Featured', value: 'featured'},
    {label: 'Research', value: 'research'},
    {label: 'Life', value: 'life'},
    {label: 'Data Analysis', value: 'data-analysis'},
    {label: 'Education', value: 'education'},
    {label: 'Productivity', value: 'productivity'},
    {label: 'WTF', value: 'wtf'}
  ];

  setActiveTab(tabValue: string): void {
    this.activeTab = tabValue;
  }
}
