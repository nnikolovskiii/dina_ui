import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-underlining-text',
  standalone: true,
  imports: [],
  templateUrl: './underlining-text.component.html',
  styleUrl: './underlining-text.component.css'
})
export class UnderliningTextComponent {
  @Input() text: string = "";
}
