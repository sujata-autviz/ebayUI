import { Component, inject } from '@angular/core';
import { AuthserviceService } from '../../../core/services/authservice.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
authService : AuthserviceService = inject(AuthserviceService)

logout(){
this.authService.logout();
}
}
