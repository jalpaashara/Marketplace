import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {User} from '../../models/user';
import {DashboardService} from '../../services/dashboard/dashboard.service';
import {Router} from '@angular/router';
import {UserDetails} from '../../models/user-details';
import {UserAccountService} from '../../services/user/user-account.service';
import {Product} from '../../models/product';
import {ProductService} from '../../services/product/product.service';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  recent: any;
  userData: User;
  categories: any;
  private isLoggedIn: boolean;
  userDetails: UserDetails;
  product: Product[] = [];


  url = environment.api + '/image/';
  constructor(public authService: AuthService,
              public router: Router,
              public userAccountService: UserAccountService,
              private productService: ProductService) {
  }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe((res) => {
      this.isLoggedIn = res;
    });
    if (this.isLoggedIn) {
    this.authService.userData.subscribe((res) => {
        // console.log(res);
        this.userData = res;
        // console.log(this.userData.email);
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
    this.getAllProducts();
    this.getCategories();
    } else {
      this.router.navigateByUrl('home');
    }
  }

  getCategories() {
    this.productService.getCategories().subscribe(res => {
      this.categories = res;
      // console.log(res);
    });
  }

  getAllProducts() {
    this.productService.getAllProducts()
      .subscribe(async (res) => {
          // console.log(res);
          const p = res;
          for (const prod of p.products) {
            // tslint:disable-next-line:one-variable-per-declaration prefer-const
            let imgIds: number[] = [], temp, i = -1;
            this.productService.getProdAllImagesId(prod.id)
              .pipe(map(im => im.images.imageIds))
              .subscribe((imgs) => {
                temp = imgs;
                for (const y of temp) {
                    imgIds.push(y);
                  }
              });
            this.product.push({
              categoryId: prod.categoryId,
              days: prod.days,
              prodDesc: prod.description,
              prodId: prod.id,
              prodName: prod.name,
              prodPrice: prod.price,
              userId: prod.userId,
              imageIds: imgIds
            });
          }
        });
  }
}
