import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {User} from '../../models/user';
import {Router} from '@angular/router';
import {UserDetails} from '../../models/user-details';
import {UserAccountService} from '../../services/user/user-account.service';
import {Product} from '../../models/product';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userData: User;
  private isLoggedIn: boolean;
  userDetails: UserDetails;
  product: Product[] = [];
  selectedCat = 0;
  component = 'dashboard';

  constructor(public authService: AuthService,
              public router: Router,
              public userAccountService: UserAccountService) {
  }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe((res) => {
      this.isLoggedIn = res;
    });
    if (this.isLoggedIn) {
      if (this.userAccountService.getCurrUserDetails() != undefined) {
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
    } else {
      this.router.navigateByUrl('home');
    }
  }
  changeEventHandler($event: number) {
    this.selectedCat = $event;
  }
}
