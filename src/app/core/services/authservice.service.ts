import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
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
    @Inject(PLATFORM_ID) private platformId: Object,
    private cookieService: CookieService
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(this.getCurrentUser());
    this.currentUser = this.currentUserSubject.asObservable();
  }
  private getHttpOptions() {
    const token = this.getCookie(this.tokenKey); // Get the latest token
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
    this.clearTokenCookie();
    this.currentUserSubject.next(null);
    this._router.navigate(['/account/login']);
  }

  getCurrentUser() {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('loginUser');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  private setToken(token: string): void {
    this.setCookie(this.tokenKey, token, 7);
  }


  private clearTokenCookie(): void {
    this.deleteCookie('authToken');
  }
  isLoggedIn(): boolean {
    const token = this.getCookie('authToken');
    return token !== null && token.trim() !== '';
  }

  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  get currentUser$(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  resetPassword(old_password: string, new_password: string) {
    const header = this.getHttpOptions();
    return this.http
      .post<any>(
        `${this.apiUrl}/change-password`,
        { old_password, new_password },
        header
      )
      .pipe(
        tap((response: { token: string; user: any }) => {
          this.currentUserSubject.next(response.user);
        })
      );
  }
  setCookie(name: string, value: string, days: number): void {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
  }

  getCookie(name: string): string | null {
    // Check if the platform is browser
    if (isPlatformBrowser(this.platformId)) {
      const match = document.cookie.match(
        new RegExp('(^| )' + name + '=([^;]+)')
      );
      if (match) {
        return match[2];
      }
    }
    return null; // Return null if not running in the browser
  }

  deleteCookie(name: string): void {
    this.setCookie(name, '', -1); // Expire the cookie
  }
}
