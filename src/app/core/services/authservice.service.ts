import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../../interfaces/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthserviceService {
  apiUrl = environment.apiUrl;
  tokenKey = 'authToken';
  public currentUser: Observable<User>;
  private currentUserSubject: BehaviorSubject<any>; // Holds the current user data

  constructor(
    private http: HttpClient,
    private _router: Router,
    @Inject(PLATFORM_ID) private platformId: Object, // Inject platform type (browser/server)
    private cookieService: CookieService
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(this.getCurrentUser());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private getHttpOptions() {
    const token = this.getCookie(this.tokenKey); // Get the latest token from cookies
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '', // Include the token if it exists
      }),
    };
  }

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap((response: { token: string; user: any }) => {
          this.setToken(response.token);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout(): void {
    this.clearToken();
    this.currentUserSubject.next(null);
    this._router.navigate(['/account/login']);
  }

  getCurrentUser() {
    // Check if running in the browser
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('loginUser');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  private setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('ebay-auth-token', token); // Save token to localStorage
    }
    this.setCookie(this.tokenKey, token, 7); // Save token to cookies as well
  }

  private clearToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('ebay-auth-token'); // Remove from localStorage
    }
    this.deleteCookie(this.tokenKey); // Remove from cookies
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('ebay-auth-token');
      return token !== null && token.trim() !== '';
    }
    const token = this.getCookie(this.tokenKey); // Check token from cookies on server-side
    return token !== null && token.trim() !== '';
  }

  resetPassword(old_password: string, new_password: string): Observable<any> {
    const headers = this.getHttpOptions();
    return this.http
      .post<any>(
        `${this.apiUrl}/change-password`,
        { old_password, new_password },
        headers
      )
      .pipe(
        tap((response: { token: string; user: any }) => {
          this.currentUserSubject.next(response.user);
        })
      );
  }

  setCookie(name: string, value: string, days: number): void {
    // Only run in browser environments
    if (isPlatformBrowser(this.platformId)) {
      let expires = '';
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
      }
      document.cookie = name + '=' + (value || '') + expires + '; path=/';
    }
  }

  getCookie(name: string): string | null {
    // Only run in browser environments
    if (isPlatformBrowser(this.platformId)) {
      const match = document.cookie.match(
        new RegExp('(^| )' + name + '=([^;]+)')
      );
      return match ? match[2] : null;
    }
    return null;
  }

  deleteCookie(name: string): void {
    this.setCookie(name, '', -1); // Expire the cookie
  }
}
