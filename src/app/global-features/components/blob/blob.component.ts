import {Component, Input} from '@angular/core';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-blob',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './blob.component.html',
  styleUrl: './blob.component.css'
})
export class BlobComponent {
  @Input() background: string = 'linear-gradient(200deg, #09427c 0%, #09427c 100%)';
  @Input() top?: string;
  @Input() left?: string;
  @Input() bottom?: string;
  @Input() right?: string;
  @Input() blurEffect: string = 'blur(100px)';
  @Input() animation: string = 'sway 7s ease-in-out infinite';
}
