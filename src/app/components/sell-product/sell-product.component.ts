import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';
import {DashboardService} from '../../services/dashboard/dashboard.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sell-product',
  templateUrl: './sell-product.component.html',
  styleUrls: ['./sell-product.component.css']
})
export class SellProductComponent implements OnInit {
  private isLoggedIn: any;
  sellProductForm: FormGroup;
  categories;

  constructor(public dashboardService: DashboardService,
              private formBuilder: FormBuilder,
              public router: Router,
              public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.sellProductForm = this.formBuilder.group({
      category: ['', Validators.required],
      prodName: ['', Validators.required],
      prodDesc: [''],
      prodPrice: ['']
    });

    this.getCategories();
  }

  onSubmit() {

  }

  getCategories() {
    this.dashboardService.getCategories().subscribe(res => {
      this.categories = res;
    });

  }

}
