import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private url = environment.api;

  constructor(public http: HttpClient) { }

  getRecentViews() {
    return this.http.get('assets/recentlyviewed.json');
  }

  getCategories() {
    // return this.http.get('assets/categories.json');
    const url = this.url + '/categories';
    return this.http.get(url);
  }
}
