import { Component, OnInit } from '@angular/core';
import {User} from '../../models/user';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-myaccount',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  userData: User;
  private isLoggedIn: boolean;
  constructor(public authService: AuthService,
              public router: Router) {}

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((res) => {
      this.isLoggedIn = res;
    });
    if (this.isLoggedIn) {
      this.authService.userData.subscribe((res) => {
        this.userData = res;
      });
    } else {
      this.router.navigateByUrl('home');
    }
  }

}
