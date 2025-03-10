import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StarButtonComponent} from '../../../../global-features/buttons/star-button/star-button.component';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    StarButtonComponent,
  CommonModule,
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
    // Payment-specific fields
    'card_number': {type: 'text', value: ''},
    'card_holder': {type: 'text', value: ''},
    'valid_to': {type: 'text', value: ''},
    'cvv_number': {type: 'password', value: ''},

    // Existing fields (keep these if you need them)
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
