import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { User } from '../../interfaces/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  apiUrl = environment.apiUrl
  tokenKey = 'token';
  public currentUser: Observable<User>;
  private currentUserSubject: BehaviorSubject<any>; // Holds the current user data

  constructor(private http: HttpClient , private _router : Router , @Inject(PLATFORM_ID) private platformId: Object) {
    this.currentUserSubject = new BehaviorSubject<any>(this.getCurrentUser());
    this.currentUser = this.currentUserSubject.asObservable();
  }
  private getHttpOptions() {
    const token = this.getToken(); // Get the latest token
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '' // Include the token if it exists
      }),
    };
  }
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response: { token: string; user: any; }) => {
        this.setToken(response.token);
        this.currentUserSubject.next(response.user); 
      })
    );
  }


  logout(): void {
    this.removeToken();
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
    localStorage.setItem(this.tokenKey,token);
  }


  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null; 
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null; 
  }

  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }


  get currentUser$(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  resetPassword(old_password: string, new_password: string) {
    const header = this.getHttpOptions();
    return this.http.post<any>(`${this.apiUrl}/change-password`, {old_password,new_password},header).pipe(
      tap((response: { token: string; user: any; }) => {
        this.currentUserSubject.next(response.user); 
      })
    );

    
} 


}
