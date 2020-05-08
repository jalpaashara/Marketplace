import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url = environment.api;

  constructor(public http: HttpClient) {}

  setProductDetails(product) {
    const url = this.url + '/products';
    return this.http.post(url, product);
  }

  getProductById(prodId) {
    const url = this.url + '/product' + '/' + prodId;
    return this.http.get(url);
  }

  getProductImage(prodId) {
    const url = this.url + '/product' + '/' + prodId + '/image';
    console.log("image url: ", url);
    return this.http.get(url);

  }
}
