import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../../auth/services/auth/auth.service';
import {Router} from '@angular/router';
import {NgForOf} from '@angular/common';
import {UserProfileComponent} from '../../../../user-profile/user-profile.component';

@Component({
  selector: 'app-dina-home',
  standalone: true,
  imports: [
    NgForOf,
    UserProfileComponent,
  ],
  templateUrl: './dina-home.component.html',
  styleUrl: './dina-home.component.css'
})
export class DinaHomeComponent implements OnInit {
  @ViewChild('container') container!: ElementRef;

  activeIndex: number = 0;

  constructor(private router: Router,
  ) {
  }

  ngOnInit() {
  }


  navigateToLink(link: string) {
    this.router.navigate(['/' + link]);
  }

  dotsArray = [0, 1, 2];

  ngAfterViewInit(): void {
    this.container.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
  }

  scrollToSection(index: number): void {
    const sections = this.container.nativeElement.querySelectorAll('.section');
    if (sections && sections[index]) {
      sections[index].scrollIntoView({behavior: 'smooth'});
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
