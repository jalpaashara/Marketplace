import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {Observable} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AboutComponent} from '../about/about.component';
import {SellProductComponent} from '../sell-product/sell-product.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isCollapsed = true;
  isLoggedIn: boolean;
  searchForm: any;
  constructor(public authService: AuthService,
              private modalService: NgbModal) {}

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((res) => {
      this.isLoggedIn = res;
    });
    // console.log(this.isLoggedIn);
  }

  openAboutModal() {
    const modalRef = this.modalService.open(SellProductComponent, {centered: true, size: 'lg'});
  }

  SignOut() {
    this.authService.SignOut()
      .then(
        res => {console.log(res); },
        err => {console.log(err); }
        );
  }

  search() {

  }
}
