import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {VerifyEmailComponent} from './components/verify-email/verify-email.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {LoginComponent} from './components/login/login.component';
import {SignupComponent} from './components/signup/signup.component';
import {HomeComponent} from './components/home/home.component';
import {AboutComponent} from './components/about/about.component';
import {MyAccountComponent} from './components/myaccount/my-account.component';
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
import {ProductComponent} from './components/product/product/product.component';
import {ChangePasswordComponent} from './components/change-password/change-password.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: 'home', component: HomeComponent},
  {path: 'register', component: SignupComponent},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'verify-email-address', component: VerifyEmailComponent},
  {path: 'about', component: AboutComponent},
  {path: 'myaccount', component: MyAccountComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'change-password', component: ChangePasswordComponent},
  {path: 'product/:id', component: ProductComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
