import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {QuestionItemComponent} from "../question-item/question-item.component";
import {NgForOf} from "@angular/common";

interface SuggestedQuestion {
  id: number;
  text: string;
}

@Component({
  selector: 'app-suggested-questions',
  templateUrl: './suggested-questions.component.html',
  standalone: true,
  imports: [
    QuestionItemComponent,
    NgForOf
  ],
  styleUrls: ['./suggested-questions.component.scss']
})
export class SuggestedQuestionsComponent implements OnInit {
  @Output() questionSubmitted = new EventEmitter<string>();

  suggestedQuestions: SuggestedQuestion[] = [
    { id: 1, text: 'Дали Каско осигурувањето го покрива моето возило доколку му е направена штета во друга држава?' },
    { id: 2, text: 'Кои видови штети (на пр. кражба, пожар, природни непогоди, вандализам) се покриени со моето Каско осигурување?' },
    { id: 3, text: 'Колкава е мојата франшиза (сопствено учество) при ликвидација на штета и како тоа влијае на износот на надоместокот?' },
    { id: 4, text: 'Како се одредува пазарната вредност на возилото во случај на тотална штета или кражба и кој износ ќе ми биде исплатен?' },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onQuestionSelected(questionText: string): void {
    console.log('Selected question:', questionText);
    this.questionSubmitted.emit(questionText);
    // Here you would typically send this question to your chat input or service
  }
}
