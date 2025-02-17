import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgForOf, NgStyle} from '@angular/common';

@Component({
  selector: 'app-random-lights',
  standalone: true,
  imports: [
    NgStyle,
    NgForOf
  ],
  templateUrl: './random-lights.component.html',
  styleUrl: './random-lights.component.css'
})
export class RandomLightsComponent implements OnInit {
  @ViewChild('container') container!: ElementRef;

  activeIndex: number = 0;

  ngOnInit() {
  }

  dotsArray = [0, 1, 2];

  ngAfterViewInit(): void {
    this.container.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
  }

  scrollToSection(index: number): void {
    const sections = this.container.nativeElement.querySelectorAll('.section');
    if (sections && sections[index]) {
      sections[index].scrollIntoView({ behavior: 'smooth' });
    }
  }

  onScroll(): void {
    const sections = this.container.nativeElement.querySelectorAll('.section');
    let currentIndex = 0;
    for (let i = 0; i < sections.length; i++) {
      if (this.container.nativeElement.scrollTop >= sections[i].offsetTop - sections[i].offsetHeight / 2) {
        currentIndex = i;
      }
    }
    this.activeIndex = currentIndex;
  }
}
