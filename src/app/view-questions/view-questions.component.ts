import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-view-questions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-questions.component.html',
  styleUrl: './view-questions.component.css'
})
export class ViewQuestionsComponent {

  response: any[] = [];
  currentPage: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://0.0.0.0:5000/collection_data/?collection_name=CodeContext').subscribe((data) => {
      this.response = data;
      console.log(this.response);
    });
  }

  formatResponse(value: any): string {
    if (typeof value === 'string') {
      // Convert Markdown-like syntax into HTML.
      let formatted = value
        .replace(/(#+) (.+)/g, (_, level, text) => `<h${level.length}>${text}</h${level.length}>`) // Headings
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.+?)\*/g, '<em>$1</em>') // Italic
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>') // Code blocks
        .replace(/\n/g, '<br>'); // Line breaks

      return formatted;
    }

    // For non-string values, return them as they are.
    return value;
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  nextPage(): void {
    if (this.currentPage < this.response.length - 1) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  getCenteredPages(): number[] {
    const totalPages = this.response.length;
    const currentPageIndex = this.currentPage + 1; // Convert to 1-based index
    const startPage = Math.max(currentPageIndex - 3, 1);
    const endPage = Math.min(currentPageIndex + 3, totalPages);

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.response.length) {
      this.currentPage = page;
    }
  }
}
