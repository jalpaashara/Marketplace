import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../services/product/product.service';
import {DomSanitizer} from '@angular/platform-browser';
import { pipe } from 'rxjs';
import {map} from 'rxjs/operators';
import {async} from 'rxjs/internal/scheduler/async';
import {environment} from '../../../../environments/environment';
import {AuthService} from '../../../services/auth/auth.service';

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

  constructor(public authService: AuthService,
              public route: ActivatedRoute,
              private prodService: ProductService,
              public router: Router) { }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((res) => {
      this.isLoggedIn = res;
    });
    if (this.isLoggedIn) {
      this.productID = this.route.snapshot.params.id;
      this.getProductById();
      this.getProductImage();
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

  /*getProductImage() {
    this.prodService.getProductImage(this.productID)
      .subscribe(res => {
        console.log(res[0].image);
        const objectURL = 'data:image/jpeg;base64,' + res[0].image;

        this.img = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        console.log(this.img);
      });
  }*/

  getProductImage() {
    this.prodService.getProdAllImagesId(this.productID)
      // this.imageIds = ;
      .subscribe(
        res => {
        console.log(res);
        this.imageIds = res;
        console.log(this.imageIds.imageIds);
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
}
