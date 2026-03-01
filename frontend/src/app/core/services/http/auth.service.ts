import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import {LoginUserRequest, RegisterUserRequest} from '@/modules/customer/auth/models/user.model';
import {environment} from '@environment/environment.development';
import {Shop} from '@/modules/admin/shop/models/shop.model';

export interface User {
  id: string;
  email: string;
  fullname?: string;
  role: 'admin' | 'shop' | 'customer';
}

export interface AuthResponse {
  accessToken: string;
  user: User;
  shop: Shop;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_info';
  private readonly USER_SHOP = 'user_shop';
  private readonly API_URL = environment.apiUrl + '/api';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private currentShopSubject = new BehaviorSubject<Shop | null>(this.getShopFromStorage());
  public currentShop$ = this.currentShopSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(userData: LoginUserRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, userData)
      .pipe(
        tap(response => this.handleAuthSuccess(response))
      );
  }

  loginGoogle(): void {
    window.location.href = `${this.API_URL}/auth/google`;
  }

  register(userData: RegisterUserRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, userData)
      .pipe(
        tap(response => this.handleAuthSuccess(response))
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.USER_SHOP);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserShop(): Shop | null {
    return this.currentShopSubject.value;
  }

  hasRole(role: 'admin' | 'shop' | 'customer'): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.accessToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    localStorage.setItem(this.USER_SHOP, JSON.stringify(response.shop));
    this.currentUserSubject.next(response.user);
    this.currentShopSubject.next(response.shop);
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  private getShopFromStorage(): Shop | null {
    const shopStr = localStorage.getItem(this.USER_SHOP);
    return shopStr ? JSON.parse(shopStr) : null;
  }
}
