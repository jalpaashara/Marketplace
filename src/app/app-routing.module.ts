import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {VerifyEmailComponent} from './components/verify-email/verify-email.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {LoginComponent} from './components/login/login.component';
import {SignupComponent} from './components/signup/signup.component';
import {HomeComponent} from './components/home/home.component';
import {AboutComponent} from './components/about/about.component';
import {MyAccountComponent} from './components/myaccount/my-account.component';
import {SellProductComponent} from './components/sell-product/sell-product.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: 'home', component: HomeComponent},
  {path: 'register', component: SignupComponent},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'verify-email-address', component: VerifyEmailComponent},
  {path: 'about', component: AboutComponent},
  {path: 'myaccount', component: MyAccountComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
