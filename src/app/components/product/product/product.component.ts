import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../services/product/product.service';
import {DomSanitizer} from '@angular/platform-browser';
import { pipe } from 'rxjs';
import {map} from 'rxjs/operators';
import {async} from 'rxjs/internal/scheduler/async';
import {environment} from '../../../../environments/environment';
import {AuthService} from '../../../services/auth/auth.service';
import {UserAccountService} from '../../../services/user/user-account.service';
import {UserDetails} from '../../../models/user-details';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  productID: any;
  productData: any;
  img = [];
  private imageIds;
  currImg: any;
  private isLoggedIn: boolean;
  public userDetails: UserDetails;

  constructor(public authService: AuthService,
              public route: ActivatedRoute,
              private prodService: ProductService,
              public router: Router,
              public userAccountService: UserAccountService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((res) => {
      this.isLoggedIn = res;
    });
    if (this.isLoggedIn) {
      this.productID = this.route.snapshot.params.id;
      this.getProductById();
      this.getProductImage();

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
    } else {
      this.router.navigateByUrl('home');
    }
  }

  getProductById() {
    this.prodService.getProductById(this.productID)
      .subscribe((res) => {
        console.log(res[0]);
        this.productData = res[0];
        if (this.productData === undefined) {
          this.router.navigateByUrl('dashboard');
        }
      });
  }

 getProductImage() {
    this.prodService.getProdAllImagesId(this.productID)
      // this.imageIds = ;
      .subscribe(
        res => {
        this.imageIds = res.images;
        console.log(typeof this.imageIds.imageIds);
        const image = this.imageIds.imageIds;
        for (const i of image) {
          this.img.push(environment.api + '/image' + '/' + i);
        }
        this.currImg = this.img[0];

      }, error => {console.log(error); }
      );

    // this.showImage();
  }

  showImage(url) {
    this.currImg = url;
  }

  removeProduct() {
    this.prodService.removeProduct(this.productID)
      .subscribe(() => {
        this.router.navigate(['dashboard']);
        this.toastr.success('Product successfully deleted.');
      }, (error) => {
      this.toastr.error('Could not delete. Please try after sometime', error);
    });
  }

  sendEmailToSeller() {

  }
}
