import {Component, Input, OnInit, OnChanges, SimpleChange, ViewChild, ElementRef, AfterViewInit, Renderer2} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserAccountService} from '../../services/user/user-account.service';
import {ProductService} from '../../services/product/product.service';
import {User} from '../../models/user';
import {UserDetails} from '../../models/user-details';
import {Product} from '../../models/product';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {faHeart as farHeart} from '@fortawesome/free-regular-svg-icons';
import {faHeart as fasHeart, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() catId: number;
  @Input() component: string;
  userData: User;
  private isLoggedIn: boolean;
  userDetails: UserDetails;
  product: Product[] = [];
  url = environment.api + '/image/';
  param;
  queryParamEntries;
  prodLength: number;
  @ViewChild('prodRef') prodRef: ElementRef;
  farHeartIcon = farHeart;
  fasHeartIcon = fasHeart;
  faTrash = faTrashAlt;
  currUserFavProdsSet = new Set();
  favProducts;

  constructor(public authService: AuthService,
              public router: Router,
              public userAccountService: UserAccountService,
              private productService: ProductService,
              public activatedRoute: ActivatedRoute,
              private renderer: Renderer2,
              private toastr: ToastrService) {}

  ngOnInit(): void {
    this.param = this.activatedRoute.snapshot.queryParams;
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
              this.userDetails = usr;
            },
            error => {console.log(error); });
      }

      this.productService.getCurrUserFavProds(this.userDetails.id)
        .subscribe(res => {
          this.favProducts = res;
          for (const prod of this.favProducts.products) {
            this.currUserFavProdsSet.add(prod.id);
          }

          if (this.component === 'myfavorites') {
            this.setProducts(this.favProducts);
          }
        });

      if (this.component === 'dashboard') {
        console.log('You are in Dashboard');
        this.getAllProducts();
      } else if (this.component === 'search') {
        console.log('You are in Search');
        this.searchProducts();
      } else if (this.component === 'mylistings') {
        console.log('You are in My Account -> My Listings');
        this.getProductsByUser();
      }
    } else {
      this.router.navigateByUrl('home');
    }
  }

  ngAfterViewInit() {
    if (this.component === 'mylistings') {
      this.renderer.setStyle(this.prodRef.nativeElement, 'padding-left', '0px');
    }
  }

  getProductsByUser() {
    this.productService.getProductsByUserId(this.userDetails.id)
      .subscribe((res) => {
        // console.log(res);
        const p = res;
        this.setProducts(p);
      });
  }

  getProductsByCategory(categoryId) {
    this.productService.getProductsByCategoryId(categoryId)
      .subscribe((res) => {
        // console.log(res);
        const p = res;
        this.setProducts(p);
      });
  }

  getAllProducts() {
    this.productService.getAllProducts()
      .subscribe(async (res) => {
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

    if (this.component === 'dashboard') {
      if (id === 0 || isNaN(id)) {
        this.getAllProducts();
      } else {
        this.getProductsByCategory(id);
      }
    }
  }

  searchProducts() {
    this.productService.seacrhProducts(this.param).subscribe((res) => {
      const p = res;
      this.setProducts(p);
    });
  }

  private setProducts(p: any) {
    this.product = [];
    this.prodLength =  p.totalRecords;
    for (const prod of p.products) {
      // tslint:disable-next-line:one-variable-per-declaration prefer-const
      let imgIds: number[] = [], temp;
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
        imageIds: imgIds,
        isFav: this.currUserFavProdsSet.has(prod.id) ? true : false
      });
    }
  }

  favorites(product) {
    console.log(product);
    if (!product.isFav) {
      this.productService.addToFavorites(this.userDetails.id, product.prodId)
        .subscribe(() => {
          this.currUserFavProdsSet.add(product.prodId);
          const index = this.product.indexOf(product);
          this.product[index].isFav = true;
          this.toastr.success('You can see it in My Account -> Profile -> My Favorites',
            'You have marked an item as favorite.');

        }, (error) => {
          this.toastr.error('Could not Favorite the item. Please try after sometime');
      });
    } else {
      this.productService.removeFromFavorites(this.userDetails.id, product.prodId)
        .subscribe(() => {
          this.currUserFavProdsSet.delete(product.prodId);
          const index = this.product.indexOf(product);
          this.product[index].isFav = false;
          this.toastr.success('Item Removed from Favirotes');
          if (this.component === 'myfavorites') {
            this.product.splice(index, 1);
            this.prodLength--;
          }

        }, (error) => {
          this.toastr.error('Could not remove item from Favorites. Please try after sometime', error.name);
          console.log(error);
        });
    }
  }

  deleteProduct(r: Product) {
    this.productService.removeProduct(r.prodId)
      .subscribe(() => {
        const index = this.product.indexOf(r);
        this.product.splice(index, 1);
        this.prodLength--;
        this.router.navigate(['dashboard']);
        this.toastr.success('Product successfully deleted.');

      }, (error) => {
        this.toastr.error('Could not delete. Please try after sometime', error);
      });
  }
}
