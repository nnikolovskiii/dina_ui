import {Component} from '@angular/core';
import {AuthService} from '../../../features/auth/services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private router: Router,
  ) {
  }

  navigateToLink(link: string) {
    this.router.navigate(['/' + link]);
  }

}
