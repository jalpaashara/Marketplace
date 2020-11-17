import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Product} from '../../models/product';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url = environment.api;

  constructor(public http: HttpClient) {}

  getCategories() {
    const url = this.url + '/categories';
    return this.http.get(url);
  }

  getCategoryById(catId): Observable<any> {
    const url = this.url + '/categories/' + catId;
    return this.http.get(url);
  }

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

  getProdAllImagesId(prodId): Observable<any>  {
    const url = this.url + '/product' + '/' + prodId + '/allImages';
    return this.http.get(url);
  }

  getProductImage(imageId) {
    const url = this.url + '/image' + '/' + imageId;
    console.log('image url: ', url);
    return this.http.get(url, { responseType: 'blob' });
  }

  getAllProducts(): Observable<any> {
    const url = this.url + '/products';
    return this.http.get(url);
  }

  removeProduct(prodId) {
    const url = this.url + '/product' + '/' + prodId;
    return this.http.delete(url, prodId);
  }

  sendEmail(data) {
    const url = this.url + '/email';
    return this.http.post(url, data);
  }

  getProductsByCategoryId(categoryId): Observable<any>  {
    const url = this.url + '/browse/' + categoryId;
    return this.http.get(url);
  }

  seacrhProducts(searchStr) {
    console.log(searchStr);
    const url = this.url + '/search?q=' + searchStr.q;
    return this.http.get(url);
  }

  getProductsByUserId(userId): Observable<any>  {
    const url = this.url + '/user/' + userId + '/products';
    return this.http.get(url);
  }

  getCurrUserFavProds(userId) {
    const url = this.url + '/user/' + userId + '/favProducts';
    return this.http.get(url);
  }

  addToFavorites(userId, prodId) {
    const url = this.url + '/user/' + userId + '/favProduct/' + prodId;
    return this.http.post(url, userId, prodId);
  }

  removeFromFavorites(userId, prodId) {
    const url = this.url + '/user/' + userId + '/favProduct/' + prodId;
    return this.http.delete(url);
  }
}
