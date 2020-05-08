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
      prodDesc: [''],
      prodPrice: ['']
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
    this.setProduct(this.createProductData());
    this.modal.dismiss('Add Listing click');
  }

  getCategories() {
    this.dashboardService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  private setProduct(productData) {
    this.productService.setProductDetails(productData).subscribe((res) => {console.log(res); }, err => console.log(err));

  }
}
