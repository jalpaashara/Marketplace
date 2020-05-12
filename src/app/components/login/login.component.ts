import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserDetails} from '../../models/user-details';
import {UserAccountService} from '../../services/user/user-account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  loading = false;
  errorMessage: string;
  userDetails: UserDetails;

  get formVal() { return this.loginForm.controls; }

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private userAccountService: UserAccountService
  ) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmitLogin() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    return this.authService.SignIn(this.loginForm.value.email, this.loginForm.value.password)
      .then(() => {
        this.errorMessage = '';
        this.userAccountService.getUserWithEmail(this.loginForm.value.email)
          .subscribe(
            (usr) => {
                  this.userDetails = {
                    id: usr[0].id,
                    email: usr[0].email,
                    firstName: usr[0].firstName,
                    lastName: usr[0].lastName,
                    phone: usr[0].phone
                  };
                  this.userAccountService.setCurrUserDetails(this.userDetails);
                }, error => {
                  console.log(error.message);
                });
      }, err => {
        console.log(err.message);
        this.errorMessage = err.message;
      });
  }
}
