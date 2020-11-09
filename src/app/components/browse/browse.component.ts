import {Component, Input, OnInit, OnChanges, SimpleChange} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {UserAccountService} from '../../services/user/user-account.service';
import {ProductService} from '../../services/product/product.service';
import {User} from '../../models/user';
import {UserDetails} from '../../models/user-details';
import {Product} from '../../models/product';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit, OnChanges {
  @Input() catId: number;
  userData: User;
  private isLoggedIn: boolean;
  userDetails: UserDetails;
  product: Product[] = [];
  url = environment.api + '/image/';
  routeURL: string;
  param;
  queryParamEntries;
  prodLength: number;

  constructor(public authService: AuthService,
              public router: Router,
              public userAccountService: UserAccountService,
              private productService: ProductService,
              public activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.routeURL = this.activatedRoute.routeConfig.path;
    this.param = this.activatedRoute.snapshot.queryParams;
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

      if (this.routeURL === 'dashboard') {
        console.log('You are in Dashboard');
        this.getAllProducts();
      } else if (this.routeURL === 'search') {
        console.log('You are in Search');
        this.searchProducts();
      }

    } else {
      this.router.navigateByUrl('home');
    }
  }

  getProductsByCategory(categoryId) {
    this.product = [];
    this.productService.getProductsByCategoryId(categoryId)
      .subscribe((res) => {
        // console.log(res);
        const p = res;
        this.setProducts(p);
      });
  }

  getAllProducts() {
    this.product = [];
    this.productService.getAllProducts()
      .subscribe(async (res) => {
        // console.log(res);
        const p = res;
        this.setProducts(p);
      });
  }

  onResize($event) {
    console.log($event.target.innerWidth);
    console.log($event.target);
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const id = Number(JSON.stringify(changes.catId.currentValue));

    if (this.routeURL === 'dashboard') {
      if (id === 0 || isNaN(id)) {
        this.getAllProducts();
      } else {
        this.getProductsByCategory(id);
      }
    }
  }

  searchProducts() {
    this.product = [];
    this.productService.seacrhProducts(this.param).subscribe((res) => {
      const p = res;
      this.prodLength =  p['totalRecords'];
      this.setProducts(p);
    });
  }

  private setProducts(p: any) {
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
  }
}
