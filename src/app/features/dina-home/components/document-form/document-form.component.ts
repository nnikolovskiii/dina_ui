import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-document-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './document-form.component.html',
  styleUrl: './document-form.component.css'
})
export class DocumentFormComponent {
  // Form field configuration with type and options
  formFields: {
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
    'Message': { type: 'textarea', value: '' }
  };

  // Expose Object to template for iteration
  Object = Object;
}
