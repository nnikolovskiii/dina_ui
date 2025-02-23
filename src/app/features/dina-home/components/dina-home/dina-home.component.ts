import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../../auth/services/auth/auth.service';
import {Router} from '@angular/router';
import {NgForOf} from '@angular/common';
import {BlobComponent} from '../../../../global-features/components/blob/blob.component';

@Component({
  selector: 'app-dina-home',
  standalone: true,
  imports: [
    NgForOf,
    BlobComponent
  ],
  templateUrl: './dina-home.component.html',
  styleUrl: './dina-home.component.css'
})
export class DinaHomeComponent implements OnInit {
  userData: any;
  @ViewChild('container') container!: ElementRef;

  activeIndex: number = 0;

  constructor(private authService: AuthService, private router: Router,
  ) {
  }

  ngOnInit() {
    this.loadUserData();
    console.log(this.userData)
  }

  loadUserData() {
    this.authService.getProtectedData().subscribe({
      next: (data) => {
        this.userData = data
        console.log(this.userData)
      },
      error: (err) => console.error('Failed to load data:', err)
    });
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
