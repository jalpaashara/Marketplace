import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {DashboardService} from '../../services/dashboard/dashboard.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UserAccountService} from '../../services/user/user-account.service';
import {UserDetails} from '../../models/user-details';
import {ProductService} from '../../services/product/product.service';
import {ToastrService} from 'ngx-toastr';

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
              private productService: ProductService,
              private toastr: ToastrService) { }

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
      this.userDetails = this.userAccountService.getCurrUserDetails();
    } else {
      this.userAccountService.currUser
        .subscribe(
          (usr) => {
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
      return;
    }
    this.setProduct(this.createProductData());
    this.toastr.success('Product successfully listed.');
    this.modal.dismiss('Add Listing Click');
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['dashboard']);
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
              this.prodId = res;
              for (let i = 0; i < this.pictures.length; i++) {
                this.setPictures(this.pictures[i]);
              }
        }, err => console.log(err));

  }

  setPictures(img) {
    const formData = new FormData();
    formData.append('file', img);
    this.productService.setProductImage(this.prodId.prodId, formData)
      .subscribe(res => {console.log(res); }, error => console.log(error));
  }
}
