import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {User} from '../../models/user';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';
import {UserAccountService} from '../../services/user/user-account.service';
import {UserDetails} from '../../models/user-details';
import {environment} from '../../../environments/environment';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-myaccount',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  userData: User;
  private isLoggedIn: boolean;
  userDetails: UserDetails = new UserDetails();
  update: any = {
    userProfile: true,
    myListings: false,
    myFavorites: false
  };

  constructor(public authService: AuthService,
              public userAccountService: UserAccountService,
              public router: Router,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {

    this.authService.isLoggedIn.subscribe((res) => {
      this.isLoggedIn = res;
    });
    if (this.isLoggedIn) {
      this.authService.userData.subscribe((res) => {
        this.userData = res;
        if (this.userAccountService.getCurrUserDetails() !== undefined) {
          this.userDetails = this.userAccountService.getCurrUserDetails();
        } else {
          this.userAccountService.currUser
            .subscribe(
              (usr) => {
                this.userDetails = usr;
              },
              error => {
                console.log(error);
              });
        }
      });
    } else {
      this.router.navigateByUrl('home');
    }
  }

  SignOut() {
    this.authService.SignOut()
      .then(
        res => {
          this.toastr.success('See you again soon!', ' You have been signed off!');
        },
        err => {
          console.log(err);
          this.toastr.error('Something went wrong! Please try again.');
        }
      );
  }

  goToUserProfile() {
      this.update = {
        userProfile: true,
        myListings: false,
        myFavorites: false
      };
  }

  goToMyListings() {
    this.update = {
      userProfile: false,
      myListings: true,
      myFavorites: false
    };
  }

  goToMyFavorites() {
    this.update = {
      userProfile: false,
      myListings: false,
      myFavorites: true
    };
  }
}
