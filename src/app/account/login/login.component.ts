import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthserviceService } from '../../core/services/authservice.service';
import { LoginResponse } from '../../interfaces/login-response/login-response';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword = false;
  errorMessage: string = '';
  constructor(
    private fb: FormBuilder,
    private _authService: AuthserviceService,
    private _route: Router,
    private _notificationService : NotificationService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  ngOnInit(): void {
  }
  onSubmit(): void {
    this.errorMessage = '';
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this._authService.login(username, password).subscribe({
        next: (response: LoginResponse) => {
          console.log('Login successful!', response);
          this._notificationService.successToast('Login successfullly');
          this._route.navigate(['/pages/dashboard']);
        },
        error: (err) => {
          console.error('Login failed!', err);
          this.errorMessage = 'Login failed. Please check your credentials.';
        },
      });
    }
  }
 
  showPwd() {
    this.showPassword = !this.showPassword;
  }
  get f() {
    return this.loginForm.controls;
  }
  resetPassword() {
    this._route.navigate(['/account/reset-password']); // Adjust the route as necessary
  }
}
