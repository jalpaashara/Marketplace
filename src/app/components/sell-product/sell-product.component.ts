import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
  prodId;
  @ViewChild('pic', { static: false }) fileDropEl: ElementRef;
  pictures: File[] = [];


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
    // console.log(this.pictures.length);
    this.submitted = true;
    if (this.sellProductForm.invalid) {
      // console.log(this.formVal.prodImages.errors);
      return;
    }
    this.setProduct(this.createProductData());
    this.toastr.success('Product successfully listed.');
    this.modal.close('Add Listing Click');
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
          // tslint:disable-next-line:prefer-for-of
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

  /*File Drop*/
  onDrop($event) {
    console.log('On drop ', $event);
    this.prepareFilesList($event);
  }

  fileBrowseHandler(files) {
    console.log('fileBrowseHandler ', files);
    this.prepareFilesList(files);
  }

  deleteFile(index: number) {
    this.pictures.splice(index, 1);
    if (this.pictures.length > 0 && this.pictures.length < 6) {
      this.sellProductForm.controls.prodImages.clearValidators();
      this.sellProductForm.controls.prodImages.updateValueAndValidity();
      console.log(this.sellProductForm.controls.prodImages);
    } else if (this.pictures.length < 1) {
      // console.log('file size < 1>');
      this.sellProductForm.controls.prodImages.clearValidators();
      this.sellProductForm.controls.prodImages.updateValueAndValidity();
      this.sellProductForm.controls.prodImages.setErrors({required: true});
    }
  }

   prepareFilesList(files: Array<any>) {
    // console.log('prepareFileList ', this.pictures);
    for (const item of files) {
      this.pictures.push(item);
    }
    // console.log('formvalue ', this.formVal);
    if (this.pictures.length > 0 && this.pictures.length < 6) {
      this.sellProductForm.controls.prodImages.clearValidators();
      this.sellProductForm.controls.prodImages.updateValueAndValidity();
      console.log(this.sellProductForm.controls.prodImages);
    } else if (this.pictures.length > 5) {
      // console.log('file size > 5');
      this.sellProductForm.controls.prodImages.clearValidators();
      this.sellProductForm.controls.prodImages.updateValueAndValidity();
      this.sellProductForm.controls.prodImages.setErrors({maxLength: true});
    }
  }

  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
