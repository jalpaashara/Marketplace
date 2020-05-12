import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../services/product/product.service';
import {environment} from '../../../../environments/environment';
import {AuthService} from '../../../services/auth/auth.service';
import {UserAccountService} from '../../../services/user/user-account.service';
import {UserDetails} from '../../../models/user-details';
import {ToastrService} from 'ngx-toastr';
import {map} from 'rxjs/operators';

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
  spin = false;
  enableMsg = false;

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
      .pipe(map(r => r[0]))
      .subscribe((res) => {
        this.productData = res;
        this.prodService.getCategoryById(this.productData.categoryId)
          .subscribe((cat) => {
            const c = cat;
            this.productData.categoryName = c.name;
          });
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
        const image = this.imageIds.imageIds;
        for (const i of image) {
          this.img.push(environment.api + '/image' + '/' + i);
        }
        this.currImg = this.img[0];

      }, error => {console.log(error); }
      );
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
    this.spin = true;
    const s = 'Interest shown for your listing on Pace Marketplace';
    console.log(this.productData.userId);
    const id = this.productData.userId;

    this.userAccountService.getUserById(id)
      .pipe(map(t => t))
      .subscribe((res: any) => {
        console.log(res.firstName);
        const r = res;
        const b = '' +
          '<p>Hi ' + r.firstName + ',</p>' +
          '<p>A user has shown interest in purchasing your item ' + this.productData.name +
          '<br> We request you to respond to their request via email mentioned below.</p>' +
          '<p>Information of the potential buyer:<br>' +
          '<b>Name: </b>' + this.userDetails.firstName + ' ' + this.userDetails.lastName +
          '<br><b>Email: </b>' + this.userDetails.email + '</p>'
        ;
        const email = [];
        email.push(r.email);
        const data = {
          subject: s,
          recipients: email,
          body: b
        };

        console.log(data);
        this.prodService.sendEmail(data)
          .subscribe(send => {
            console.log(send);
            this.spin = false;
            this.enableMsg = true;
          });
      });


  }
}
