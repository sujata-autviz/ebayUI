import { Component, inject } from '@angular/core';
import { AuthserviceService } from '../../../core/services/authservice.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
authService : AuthserviceService = inject(AuthserviceService)
constructor(private _route : Router){

}
logout(){
this.authService.logout();
}
isDropdownOpen = false; // Control dropdown visibility

toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}

resetPassword() {
  // Redirect to the reset password page
  this._route.navigate(['/account/reset-password']); // Adjust the route as necessary
}


}
