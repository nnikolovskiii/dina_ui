import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-sandwich-toggle',
  standalone: true,
  imports: [
    NgClass,
    NgIf
  ],
  templateUrl: './sandwich-toggle.component.html',
  styleUrls: ['./sandwich-toggle.component.css']
})
export class SandwichToggleComponent {
  @Input() isOpen = false;
  @Output() toggleMenu = new EventEmitter<void>();

  onToggleMenu(): void {
    this.toggleMenu.emit();
  }
}
