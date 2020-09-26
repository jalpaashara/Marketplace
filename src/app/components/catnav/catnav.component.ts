import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../services/product/product.service';

@Component({
  selector: 'app-catnav',
  templateUrl: './catnav.component.html',
  styleUrls: ['./catnav.component.css']
})
export class CatnavComponent implements OnInit {
  categories;

  constructor(public productService: ProductService) { }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.productService.getCategories().subscribe(res => {
      this.categories = res;
    });

  }

}
