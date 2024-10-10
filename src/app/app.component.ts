import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { authInterceptorInterceptor } from './core/interceptors/auth-interceptor.interceptor';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { AccountModule } from './account/account.module';
import { CommonModule } from '@angular/common';
import { LayoutsModule } from './layouts/layouts.module';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AccountModule,
    CommonModule,
    HttpClientModule,
    LayoutsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] ,
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useValue: authInterceptorInterceptor,
      multi: true,
    },
    // HttpClient
  ],
 
  template: `<router-outlet></router-outlet>`,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
  }
  title = 'ebaybot';
}
