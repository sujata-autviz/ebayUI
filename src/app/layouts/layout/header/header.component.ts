import { Component, inject } from '@angular/core';
import { AuthserviceService } from '../../../core/services/authservice.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
authService : AuthserviceService = inject(AuthserviceService)
constructor(private _route : Router,
  private _notificatonService : NotificationService
){

}
logout(){
this.authService.logout();
this._notificatonService.successToast('Logged out successfully');
}
isDropdownOpen = false; 

toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}

resetPassword() {
  this._route.navigate(['/account/reset-password']); 
}


}
