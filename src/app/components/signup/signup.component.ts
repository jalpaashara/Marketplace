import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  loading = false;
  successMessage: string;
  errorMessage: string;

  // convenience getter for easy access to form fields
  get formVal() { return this.registerForm.controls; }

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private registerService: AuthService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,
                      // Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
                      Validators.minLength(6),
                      // Validators.maxLength(25)
        ]],
      confirmPassword: ['', Validators.required]
    }, {validators: this.checkPasswordMatch('password', 'confirmPassword')});

    // console.log(this.registerForm.controls.confirmPassword);
  }

  private checkPasswordMatch(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      const passwordInput = group.controls[passwordKey];
      const passwordConfirmationInput = group.controls[passwordConfirmationKey];

      if (passwordConfirmationInput.errors && !passwordConfirmationInput.errors.notSame) {
        return;
      }

      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notSame: true});
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }

  /*onSubmitRegister() {
    console.log(this.registerForm.controls.password);
    console.log(this.registerForm.controls.confirmPassword);
    console.log(this.registerForm.value);
    console.log(this.registerForm.errors);

    this.submitted = true;
// return for here if form is invalid
    /!*if (this.registerForm.invalid) {
      console.log('Invalid: ', this.registerForm.invalid, " ", this.registerForm.errors);
      return;
    }*!/
    this.loading = true;
    this.registerService.SignUp(this.registerForm.value.email, this.registerForm.value.password)
      .then(data => {console.log('Registration successful'); },
        error => {this.loading = false; });
  }*/

  onSubmitRegister() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      console.log('Invalid: ', this.registerForm.invalid, ' ', this.registerForm.errors);
      return;
    }

    this.registerService.SignUp(this.registerForm.value.email, this.registerForm.value.password)
      .then(res => {
        console.log(res);
        this.errorMessage = '';
        this.successMessage = 'Your account has been created';
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
        this.successMessage = '';
      });
  }

}
