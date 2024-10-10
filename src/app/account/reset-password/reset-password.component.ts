import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthserviceService } from '../../core/services/authservice.service';
import { finalize, takeUntil } from 'rxjs';
import { error } from 'console';
import { BaseDestroyCompoent } from '../../shared/utils/baseDestroy';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent extends BaseDestroyCompoent{
  resetPasswordForm: FormGroup;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private fb: FormBuilder ,
    private _authService: AuthserviceService,
    private _router : Router) {
    super();
    this.resetPasswordForm = this.fb.group({
      old_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }


  toggleOldPassword() {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  onResetPassword() {
    if (this.resetPasswordForm.valid) {
      const { old_password, new_password } = this.resetPasswordForm.value;
     this._authService.resetPassword(old_password, new_password ).pipe((takeUntil(this.destroy$) , finalize(()=>{

     }))).subscribe(res=>{
      this.successMessage = 'Password reset successfully!';
      this.errorMessage = null;
      this.resetPasswordForm.reset();
      this._router.navigate(['/dashboard']);
     },error=>{})
     this.successMessage = null;
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.successMessage = null;
    }
  }
  goBack() {
    this._router.navigate(['/dashboard']); // Update with your desired route
  }
}