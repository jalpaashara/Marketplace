import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import {AngularFireModule} from '@angular/fire';
import { AngularFireAuthModule} from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import {AuthService} from './services/auth/auth.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import {NgbModalModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './components/home/home.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AboutComponent } from './components/about/about.component';
import { MyAccountComponent } from './components/myaccount/my-account.component';
import { SellProductComponent } from './components/sell-product/sell-product.component';
import {DashboardService} from './services/dashboard/dashboard.service';
import {HttpClientModule} from '@angular/common/http';
import {UserAccountService} from './services/user/user-account.service';
import { ProductComponent } from './components/product/product/product.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    NavbarComponent,
    HomeComponent,
    AboutComponent,
    MyAccountComponent,
    SellProductComponent,
    ProductComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModalModule,
    FormsModule
  ],
  providers: [AuthService, DashboardService, UserAccountService],
  bootstrap: [AppComponent]
})
export class AppModule { }
