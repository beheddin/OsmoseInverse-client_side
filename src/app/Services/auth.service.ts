import { OnInit, Injectable, inject, Inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
import { Observable, map, catchError, throwError } from 'rxjs';
import {
  HttpClientModule,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { jwtDecode, JwtPayload } from 'jwt-decode';

import { environment } from '../../environments/environment';
import { LoginInterface } from '../Interfaces/login.interface';
import { LoginResponseInterface } from '../Interfaces/login-response.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';
import { CompteInterface } from '../Interfaces/compte.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  private apiUrl: string = environment.COMPTE_API_URL;
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

  login(credentials: LoginInterface): Observable<LoginResponseInterface> {
    return this.http
      .post<LoginResponseInterface>(`${this.apiUrl}/login`, credentials)
      .pipe(
        map((response: LoginResponseInterface) => {
          if (response.isSuccessful)
            localStorage.setItem(this.tokenKey, response.token);
          return response;
        })
        //Added catchError to login method to handle errors properly
        //catchError(this.handleError)
      );
  }

  // registration(user: CompteInterface): Observable<string> {
  registration(user: CompteInterface): Observable<MessageResponseInterface> {
    // return this.http.post<string>(`${this.apiUrl}/post`, user);
    return this.http
      .post<MessageResponseInterface>(`${this.apiUrl}/post`, user)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
          //catchError(this.handleError)
        })
      );
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
        nom: decodedToken.nom,
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

  // // provide meaningful error messages
  // private handleError(error: HttpErrorResponse): Observable<never> {
  //   let errorMessage = 'Unknown error!';

  //   if (error.error instanceof ErrorEvent) {
  //     // a client-side/network error occurred
  //     errorMessage = `Error: ${error.error.message}`;
  //   } else {
  //     // the backend returned an unsuccessful response code
  //     // errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  //     switch (error.status) {
  //       case 409: // Conflict
  //         errorMessage = `Conflict: ${error.error}`;
  //         break;
  //       case 404: // Not Found
  //         errorMessage = `Not Found: ${error.error}`;
  //         break;
  //       case 500: // Internal Server Error
  //         errorMessage = `Internal Server Error: ${error.error}`;
  //         break;
  //       default:
  //         errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  //     }
  //   }
  //   return throwError(errorMessage);
  // }
}
