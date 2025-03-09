import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  @Input() formFields: {
    [key: string]: {
      type: string;
      value: any;
      options?: string[];
    }
  } = {
    'First Name': {type: 'text', value: ''},
    'Email Address': {type: 'email', value: ''},
    'Subscribe': {type: 'checkbox', value: false},
    'Country': {type: 'dropdown', value: '', options: ['USA', 'Canada', 'UK']},
    'Message': {type: 'textarea', value: ''},
    'Interests': {
      type: 'checkbox-group',
      value: [],
      options: ['Sports', 'Music', 'Reading']
    },
  };

  // TODO: I don't know what this is.
  Object = Object;

  @Output() generate = new EventEmitter<any>();

  onGenerateClick() {
    this.generate.emit(this.formFields);
  }
}
