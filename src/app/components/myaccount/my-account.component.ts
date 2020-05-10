import { Component, OnInit } from '@angular/core';
import {User} from '../../models/user';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';
import {UserAccountService} from "../../services/user/user-account.service";
import {UserDetails} from "../../models/user-details";

@Component({
  selector: 'app-myaccount',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  userData: User;
  private isLoggedIn: boolean;
  userDetails: UserDetails = new UserDetails();
  constructor(public authService: AuthService,
              public userAccountService: UserAccountService,
              public router: Router) {}

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((res) => {
      this.isLoggedIn = res;
    });
    console.log(this.isLoggedIn);
    if (this.isLoggedIn) {
      this.authService.userData.subscribe((res) => {
        this.userData = res;

        if (this.userAccountService.getCurrUserDetails() !== undefined) {
          console.log(this.userAccountService.getCurrUserDetails());
          this.userDetails = this.userAccountService.getCurrUserDetails();
        } else {
          this.userAccountService.currUser
            .subscribe(
              (usr) => {
                console.log(usr);
                this.userDetails = usr;
              },
              error => {console.log(error); });
        }
      });
    } else {
      this.router.navigateByUrl('home');
    }
  }

}
