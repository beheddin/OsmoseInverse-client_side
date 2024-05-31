import { OnInit, Injectable, inject, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, map, catchError, throwError } from 'rxjs';
import {
  HttpClientModule,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';

import { environment } from '../../environments/environment';
import { LoginRequest } from '../interfaces/login-request';
import { LoginResponse } from '../interfaces/login-response';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  private apiUrl: string = environment.USER_API_URL;
  // private tokenKey: string = 'token';
  private tokenKey: string = 'jwt';
  private http = inject(HttpClient);

  // constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // if (isPlatformBrowser(this.platformId)) {
    //   const value = localStorage.getItem('jwt');
    //   console.log(value);
    // }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        map((response: LoginResponse) => {
          if (response.isSuccessful)
            localStorage.setItem(this.tokenKey, response.token);
          return response;
        }),
        //Added catchError to login method to handle errors properly
        catchError(this.handleError)
      );
    //.subscribe();
  }

  private getToken = (): string | null =>
    // localStorage.getItem(this.tokenKey) || '';
    localStorage.getItem(this.tokenKey);

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired();
  }

  private isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true; //token is expired

    try {
      // const decoded = jwtDecode(token);
      //use JwtPayload from jwt-decode to ensure type safety when decoding the token
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded.exp) return true;

      // const isExpired = Date.now() >= decoded['exp']! * 1000;
      const isExpired = Date.now() >= decoded.exp * 1000;

      if (isExpired) this.logout();

      return isExpired;
    } catch (error) {
      console.error('Token decoding failed:', error);
      return true;
    }
  }

  //method 1
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // //method 2
  // logout(): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
  //     tap((response: any) => {
  //       // Handle the response if needed
  //     })
  //   );
  // }

  // getUserDetails(): Observable<any> {
  getUserDetails(): any {
    const token = this.getToken();
    // if (!token) return {};
    if (!token) return null;

    try {
      const decodedToken: any = jwtDecode(token);
      const userDetails = {
        id: decodedToken.sub,
        firstName: decodedToken.firstName,
        lastName: decodedToken.lastName,
      };
      // console.log(decodedToken);
      //console.log(userDetails);

      return userDetails;
    } catch (error) {
      console.error('Token decoding failed:', error);
      return null;
    }
  }
  //   return this.http
  //   .get(`${this.apiUrl}/authenticatedUser`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   })
  //   .pipe(
  //     map((res: any) => {
  //       return res;
  //     })
  //   );

  // provide meaningful error messages
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
