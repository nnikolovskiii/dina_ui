import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-question-item',
  templateUrl: './question-item.component.html',
  standalone: true,
  styleUrls: ['./question-item.component.scss']
})
export class QuestionItemComponent {
  @Input() questionText: string = '';
  @Output() questionSelected = new EventEmitter<string>();

  onSelectQuestion(): void {
    this.questionSelected.emit(this.questionText);
  }
}
