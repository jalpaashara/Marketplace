import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {DashboardService} from '../../services/dashboard/dashboard.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UserAccountService} from '../../services/user/user-account.service';
import {UserDetails} from '../../models/user-details';
import {ProductService} from '../../services/product/product.service';

@Component({
  selector: 'app-sell-product',
  templateUrl: './sell-product.component.html',
  styleUrls: ['./sell-product.component.css']
})
export class SellProductComponent implements OnInit {
  sellProductForm: FormGroup;
  categories;
  private userDetails: UserDetails;
  submitted = false;
  pictures: FileList;
  prodId;

  get formVal() { return this.sellProductForm.controls; }

  constructor(public dashboardService: DashboardService,
              private formBuilder: FormBuilder,
              public router: Router,
              public modal: NgbActiveModal,
              private userAccountService: UserAccountService,
              private productService: ProductService) { }

  ngOnInit(): void {
    this.sellProductForm = this.formBuilder.group({
      category: ['', Validators.required],
      prodName: ['', Validators.required],
      prodDesc: ['', Validators.required],
      prodPrice: ['', Validators.required],
      prodImages: ['', [Validators.required]]
    });



    this.getCategories();

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
  }

  createProductData() {
    return {
      prodName: this.sellProductForm.value.prodName,
      categoryId: this.sellProductForm.value.category,
      prodDesc: this.sellProductForm.value.prodDesc,
      prodPrice: this.sellProductForm.value.prodPrice,
      userId: this.userDetails.id
    };
  }

  onSubmit() {
    console.log(this.createProductData());
    this.submitted = true;
    if (this.sellProductForm.invalid) {
      console.log('Invalid: ', this.sellProductForm.invalid, ' ', this.formVal, ' ', this.sellProductForm.value);
      return;
    }
    this.setProduct(this.createProductData());
    this.modal.dismiss(this.router.navigateByUrl('product/' + this.prodId));
  }

  getCategories() {
    this.dashboardService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  private setProduct(productData) {
    this.productService.setProductDetails(productData)
      .subscribe(
        (res) => {
              console.log(res);
              this.prodId = res;
              console.log(this.pictures);
              console.log(this.prodId.prodId);
              for (let i = 0; i < this.pictures.length; i++) {
                console.log(this.pictures[i].name);
                this.setPictures(this.pictures[i]);
              }
          }, err => console.log(err));

  }

  setPictures(img) {
    const formData = new FormData();
    formData.append('file', img);
    console.log(formData);
    this.productService.setProductImage(this.prodId.prodId, formData)
      .subscribe(res => {console.log(res); }, error => console.log(error));
  }
}
