import { Component, OnInit } from '@angular/core';
import {User} from '../../models/user';
import {UserDetails} from '../../models/user-details';
import {AuthService} from '../../services/auth/auth.service';
import {UserAccountService} from '../../services/user/user-account.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userData: User;
  private isLoggedIn: boolean;
  userDetails: UserDetails = new UserDetails();
  update: any = {
    firstName: false,
    lastName: false,
    phone: false
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

  editClickFN() {
    this.update = {
      firstName: true,
      lastName: false,
      phone: false,
    };
  }

  editClickLN() {
    this.update = {
      firstName: false,
      lastName: true,
      phone: false,
    };
  }

  editClickP() {
    this.update = {
      firstName: false,
      lastName: false,
      phone: true,
    };
  }

  cancelClick() {
    this.update = {
      firstName: false,
      lastName: false,
      phone: false,
    };
  }

  updateUserInfo(name: string, value: string) {
    const id = this.userDetails.id;
    let data;
    if (name === 'firstName') {
      data = {firstName: value };
      this.userDetails.firstName = value;
    } else if (name === 'lastName') {
      data = {lastName: value };
      this.userDetails.lastName = value;
    } else {
      data = {phone: value };
      this.userDetails.phone = value;
    }
    this.userAccountService.updateUserInfo(id, data)
      .subscribe(res => {
        console.log(res);
        this.userAccountService.setCurrUserDetails(this.userDetails);
        this.toastr.success(name + ' successfully updated.');
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['myaccount']);
      }, error => {
        this.toastr.error('Something went wrong! Please try again.');
      });

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

  DeleteUserAccount() {
    this.authService.DeleteUser()
      .then(
        res => {
          this.userAccountService.deleteUserAccount(this.userDetails.id).subscribe(
            del => {

              this.router.navigateByUrl('home');
              this.toastr.success('We are sad to see yo go!', ' Your account has been deleted!');
            },
            err => {
              console.log(err);
              this.toastr.error('Something went wrong! Please try again.');
            }
          );
        },
        err => {
          console.log(err);
          this.toastr.error(err.message);
        }
      );
  }

}
