import { Component, OnInit } from '@angular/core';
import {User} from '../../models/user';
import {UserDetails} from '../../models/user-details';
import {Product} from '../../models/product';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';
import {UserAccountService} from '../../services/user/user-account.service';

@Component({
  selector: 'app-search-products',
  templateUrl: './search-products.component.html',
  styleUrls: ['./search-products.component.css']
})
export class SearchProductsComponent implements OnInit {

  userData: User;
  private isLoggedIn: boolean;
  userDetails: UserDetails;
  product: Product[] = [];
  selectedCat = 0;

  constructor(public authService: AuthService,
              public router: Router,
              public userAccountService: UserAccountService) {
  }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe((res) => {
      this.isLoggedIn = res;
    });
    if (this.isLoggedIn) {
      this.authService.userData.subscribe((res) => {
        this.userData = res;
      });

      if (this.userAccountService.getCurrUserDetails() !== undefined) {
        this.userDetails = this.userAccountService.getCurrUserDetails();
      } else {
        this.userAccountService.currUser
          .subscribe(
            (usr) => {
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
