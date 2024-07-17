import { OnInit, Injectable, inject, Inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
import { Observable, map, catchError, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { LoginInterface } from '../Interfaces/login.interface';
import { LoginResponseInterface } from '../Interfaces/login-response.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';
import { CompteInterface } from '../Interfaces/compte.interface';
import { EntityResponseInterface } from '../Interfaces/entity-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = environment.COMPTE_API_URL;
  // private tokenKey: string = 'token';
  private tokenKey: string = 'jwt';

  //private http = inject(HttpClient);
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(credentials: LoginInterface): Observable<LoginResponseInterface> {
    return this.http
      .post<LoginResponseInterface>(`${this.baseUrl}/login`, credentials)
      .pipe(
        map((response: LoginResponseInterface) => {
          if (response.isSuccessful) {
            // //method 1: store tokenKey in the localStorage
            // localStorage.setItem(this.tokenKey, response.token);

            //method 2: store tokenKey in the cookies
            this.cookieService.set(this.tokenKey, response.token, {
              secure: true,
              sameSite: 'None',
              expires: 1, // set expiration time in days
            });
          }
          return response;
        })
      );
  }

  private getToken = (): string | null =>
    //localStorage.getItem(this.tokenKey);  //method 1: token in localStorage
    this.cookieService.get(this.tokenKey); //method 2: token in cookies

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded.exp) return false;
      const isExpired = Date.now() >= decoded.exp * 1000;
      if (isExpired) this.logout();
      return !isExpired;
    } catch (error) {
      console.error('Token decoding failed:', error);
      return false;
    }
  }

  //method 1
  logout(): void {
    // localStorage.removeItem(this.tokenKey);  //method 1
    this.cookieService.delete(this.tokenKey); //method 2
  }

  // //method 2
  // logout(): Observable<MessageResponseInterface> {
  //   return this.http
  //     .post<MessageResponseInterface>(
  //       `${this.baseUrl}/logout`,
  //       {},
  //       { withCredentials: true }
  //     )
  //     .pipe(
  //       tap((response: MessageResponseInterface) => {
  //         if (response.isSuccessful) {
  //           // Delete the JWT cookie
  //           this.cookieService.delete(this.tokenKey);
  //         }
  //       }),
  //       catchError((error: HttpErrorResponse) => {
  //         console.error('Logout error:', error);
  //         return throwError(() => new Error('Logout failed'));
  //       })
  //     );
  // }

  //used in TopnavComponent
  // getUserDetails(): Observable<any> {
  getUserDetails(): any {
    const token = this.getToken();
    // if (!token) return {};
    if (!token) return null;

    try {
      const decodedToken: any = jwtDecode(token);
      // console.log(decodedToken);

      return {
        //id: decodedToken.sub,
        nom: decodedToken.nom,
        cin: decodedToken.cin,
        role: decodedToken.role,
        filiale: decodedToken.filiale,
      };
    } catch (error) {
      console.error('Token decoding failed:', error);
      return null;
    }
  }

  //used in ProfileComponent
  getAuthenticatedCompte(): Observable<
    EntityResponseInterface<CompteInterface>
  > {
    // getAuthenticatedCompte(): Observable<any> {
    return this.http.get<EntityResponseInterface<CompteInterface>>(
      // return this.http.get<any>(
      `${this.baseUrl}/authenticatedCompte`,
      { withCredentials: true }
    );
  }
}
