import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserAccountService} from '../../services/user/user-account.service';
import {ProductService} from '../../services/product/product.service';
import {User} from '../../models/user';
import {UserDetails} from '../../models/user-details';
import {Product} from '../../models/product';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {
  recent: any;
  userData: User;
  categories: any;
  private isLoggedIn: boolean;
  userDetails: UserDetails;
  product: Product[] = [];
  url = environment.api + '/image/';
  sub;
  category = {
    categoryId: null,
    categoryName: null
  };

  constructor(public authService: AuthService,
              public router: Router,
              public userAccountService: UserAccountService,
              private productService: ProductService,
              public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((res) => {
      this.isLoggedIn = res;
    });

    if (this.isLoggedIn) {

      this.category.categoryName = this.route.snapshot.paramMap.get('category');
      this.category.categoryId = this.route.snapshot.queryParamMap.get('id');

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
      this.getAllProducts();
      // this.getCategories();
    } else {
      this.router.navigateByUrl('home');
    }

  }

  getAllProducts() {
    this.productService.getProductsByCategoryId(this.category.categoryId)
      .subscribe((res) => {
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

  onResize($event) {
    console.log($event.target.innerWidth);
    console.log($event.target);
  }
}
