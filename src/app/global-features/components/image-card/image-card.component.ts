import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-image-card',
  standalone: true,
  imports: [],
  templateUrl: './image-card.component.html',
  styleUrl: './image-card.component.css'
})
export class ImageCardComponent {
  @Input() imageUrl: string = '../../../../assets/automation.png';
  @Input() title: string = '';
  @Input() description: string = "";
}
