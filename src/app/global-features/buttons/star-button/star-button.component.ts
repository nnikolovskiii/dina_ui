import {booleanAttribute, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-star-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-button.component.html',
  styleUrl: './star-button.component.css'
})
export class StarButtonComponent {
  @Input() bgColor: string = 'yellow';
  @Input({transform: booleanAttribute}) haveStars: boolean = true;
  @Input() hoverBgColor: string = 'green';
  @Input() paddingX: string = '12px';
  @Input() paddingY: string = '35px';
  @Input() text: string = 'Прашај ја Софија!';
  @Input() textColor: string = 'black';
  @Input() boxShadow: string = '#fec1958c';


  @Output() buttonClicked = new EventEmitter<void>();

  onClick() {
    this.buttonClicked.emit();
  }
}
