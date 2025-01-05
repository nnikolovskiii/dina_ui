import {Component, ElementRef, Input, AfterViewInit} from '@angular/core';
import hljs from 'highlight.js';
@Component({
  selector: 'app-highlight',
  standalone: true,
  imports: [],
  templateUrl: './highlight.component.html',
  styleUrl: './highlight.component.css'
})
export class HighlightComponent implements AfterViewInit {
  @Input() code: string = `
    import { Component } from '@angular/core';

    @Component({
      selector: 'app-root',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.css']
    })
    export class AppComponent {
      title = 'highlight-example';
    }
  `; // Code snippet to highlight

  @Input() language: string = 'json'; // Language for syntax highlighting

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.highlightCode();
    });
  }

  private highlightCode(): void {
    const codeBlock = this.el.nativeElement.querySelector('pre code');
    console.log('CodeBlock:', codeBlock);
    if (codeBlock) {
      hljs.highlightElement(codeBlock);
    }
  }
}
