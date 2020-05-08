import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProductService} from '../../../services/product/product.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  productID: any;
  productData: any;
  img: any;

  constructor(public route: ActivatedRoute,
              private prodService: ProductService,
              private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    console.log(this.route.snapshot.params.id);
    this.productID = this.route.snapshot.params.id;
    this.getProductById();
    this.getProductImage();
  }

  getProductById() {
    this.prodService.getProductById(this.productID)
      .subscribe((res) => {
        // console.log(res[0]);
        this.productData = res[0];
      });
  }

  getProductImage() {
    this.prodService.getProductImage(this.productID)
      .subscribe(res => {
        console.log(res[0].image);
        const objectURL = 'data:image/jpeg;base64,' + res[0].image;

        this.img = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        console.log(this.img);
      });
  }

  showImage() {

  }
}
