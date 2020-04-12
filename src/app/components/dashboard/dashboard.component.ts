import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {User} from '../../models/user';
import {DashboardService} from '../../services/dashboard/dashboard.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  recent: any;
  userData: User;
  categories: any;
  private isLoggedIn: boolean;
  constructor(public authService: AuthService,
              public dashboardService: DashboardService,
              public router: Router) {}

  ngOnInit() {
    this.authService.isLoggedIn.subscribe((res) => {
      this.isLoggedIn = res;
    });
    if (this.isLoggedIn) {
    this.authService.userData.subscribe((res) => {
        console.log(res);
        this.userData = res;
      });
    this.getRecentViews();
    this.getCategories();
    } else {
      this.router.navigateByUrl('home');
    }
  }

  getRecentViews() {
    this.dashboardService.getRecentViews().subscribe(res => {
      console.log(res); this.recent = res; });
  }

  getCategories() {
    this.dashboardService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }
}
