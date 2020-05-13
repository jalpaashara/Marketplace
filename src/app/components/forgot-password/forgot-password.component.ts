import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(public authService: AuthService,
              public router: Router,
              private toastr: ToastrService) { }

  ngOnInit(): void {
  }


  ForgotPassword(value: string) {
    this.authService.ForgotPassword(value).then((res) => {
        this.toastr.success('Please check your inbox', 'Password reset email sent');
        this.router.navigate(['home']);
    }).catch((err) => {
      this.toastr.error('Please try again.');
    });
  }
}
