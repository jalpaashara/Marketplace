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

  setProductImage(prodId, picture) {
    const url = this.url + '/product' + '/' + prodId + '/image';
    return this.http.post(url, picture);
  }

  getProductById(prodId) {
    const url = this.url + '/product' + '/' + prodId;
    return this.http.get(url);
  }

  getProdAllImagesId(prodId) {
    const url = this.url + '/product' + '/' + prodId + '/allImages';
    return this.http.get(url);
  }

  getProductImage(imageId) {
    const url = this.url + '/image' + '/' + imageId;
    console.log('image url: ', url);
    return this.http.get(url, { responseType: 'blob' });
  }
}
