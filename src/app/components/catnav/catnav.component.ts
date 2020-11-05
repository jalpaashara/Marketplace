import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ProductService} from '../../services/product/product.service';

@Component({
  selector: 'app-catnav',
  templateUrl: './catnav.component.html',
  styleUrls: ['./catnav.component.css']
})
export class CatnavComponent implements OnInit {
  categories;
  @Output() catEvent: EventEmitter<number> = new EventEmitter<number>();
  m = 0;
  selectedValue = 'All Categories';

  constructor(public productService: ProductService) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.productService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  onCategoryChange(m, name) {
    this.catEvent.emit(m);
    this.selectedValue = name;
  }
}
