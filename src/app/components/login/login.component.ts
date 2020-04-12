import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

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

  get formVal() { return this.loginForm.controls; }

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmitLogin() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      console.log('Invalid: ', this.loginForm.invalid, ' ', this.loginForm.errors);
      return;
    }
    return this.authService.SignIn(this.loginForm.value.email, this.loginForm.value.password)
      .then(res => {
        this.errorMessage = '';
      }, err => {
        console.log(err.message);
        this.errorMessage = err.message;
      });
  }
}
