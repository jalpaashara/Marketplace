import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(public http: HttpClient) { }

  getRecentViews() {
    return this.http.get('assets/recentlyviewed.json');
  }

  getCategories() {
    return this.http.get('assets/categories.json');
  }
}
