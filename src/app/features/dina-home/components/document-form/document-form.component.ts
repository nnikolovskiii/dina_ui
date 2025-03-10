import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {StarButtonComponent} from '../../../../global-features/buttons/star-button/star-button.component';

@Component({
  selector: 'app-document-form',
  standalone: true,
  imports: [CommonModule, FormsModule, StarButtonComponent],
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.css'] // note plural 'styleUrls'
})
export class DocumentFormComponent {
  @Input() formFields: {
    [key: string]: {
      type: string;
      value: any;
      options?: string[];
    }
  } = {
    'First Name': { type: 'text', value: '' },
    'Email Address': { type: 'email', value: '' },
    'Subscribe': { type: 'checkbox', value: false },
    'Country': { type: 'dropdown', value: '', options: ['USA', 'Canada', 'UK'] },
    'Message': { type: 'textarea', value: '' },
    'Interests': {
      type: 'checkbox-group',
      value: [],
      options: ['Sports', 'Music', 'Reading']
    },
  };

  Object = Object;

  @Output() generate = new EventEmitter<any>(); // <-- Changed to emit any data

  onGenerateClick() {
    // Emit the current form data
    this.generate.emit(this.formFields);
  }

  // Add this method to handle checkbox group selections
  toggleSelection(fieldKey: string, optionValue: string) {
    const field = this.formFields[fieldKey];
    const index = field.value.indexOf(optionValue);
    if (index === -1) {
      field.value.push(optionValue);
    } else {
      field.value.splice(index, 1);
    }
  }
}
