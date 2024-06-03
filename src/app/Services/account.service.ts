import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import { decode } from 'punycode';

/*
 * The @Injectable decorator has been applied to the AccountService class.
 * This decorator is used to tell Angular that this class will be used as a service,
 * by doing this other classes are allowed to access the functionality of our account service class through a feature called dependency injection.
 */

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  // // Need HttpClient to communicate over HTTP with Web API

  // // Url to access our Web API’s
  // private baseUrl: string = 'https://localhost:5001/Users';

  // // User related properties
  // loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());
  // // cin = new BehaviorSubject<string>(localStorage.getItem('cin'));
  // // private firstName = new BehaviorSubject<string>(
  // //   localStorage.getItem('firstName') ?? ''
  // // );
  // // private userRole = new BehaviorSubject<string>(
  // //   localStorage.getItem('userRole') ?? ''
  // // );

  // constructor(private http: HttpClient) {}

  // //Login Method
  // login(form: any) {
  //   const cin = form.value.cin;
  //   const pwd = form.value.password;

  //   // pipe() let you combine multiple functions into a single function.
  //   // pipe() runs the composed functions in sequence.
  //   return (
  //     this.http
  //       // .post<any>(this.baseUrlLogin, {username, password})
  //       .post<any>(
  //         //'https://localhost:44386/Users/login',
  //         `${this.baseUrl}/login`,
  //         // form.value,
  //         { cin, pwd },
  //         {
  //           withCredentials: true,
  //         }
  //       )
  //       .pipe(
  //         map((result) => {
  //           // login successful if there's a jwt token in the response
  //           // if (result && result.token) {
  //           if (result) {
  //             // store user details and jwt token in local storage to keep user logged in between page refreshes

  //             this.loginStatus.next(true);
  //             localStorage.setItem('loginStatus', '1');
  //             localStorage.setItem('jwt', result.token);
  //             // this.cin.next(localStorage.getItem('cin'));
  //             // this.cin =localStorage.getItem('cin');

  //             //localStorage.setItem('expiration', result.expiration);
  //             // localStorage.setItem('cin', result.cin);
  //             // localStorage.setItem('firstName', result.firstName);
  //             // localStorage.setItem('userRole', result.userRole);
  //             // this.firstName.next(localStorage.getItem('firstName') ?? '');
  //             // this.userRole.next(localStorage.getItem('userRole') ?? '');
  //           }

  //           return result;
  //         })
  //       )
  //   );
  // }

  // checkLoginStatus(): boolean {
  //   var loginCookie = localStorage.getItem('loginStatus');

  //   if (loginCookie == '1') {
  //     if (
  //       localStorage.getItem('jwt') === null ||
  //       localStorage.getItem('jwt') === undefined
  //     )
  //       return false;
  //     else return true;
  //   } else return true;

  //   //   // Get and Decode the Token
  //   //   const token = localStorage.getItem('jwt');

  //   //   const decoded = jwt_decode(token);

  //   //   // Check if the cookie is valid
  //   //   if (decoded.exp === undefined) {
  //   //     return false;
  //   //   }

  //   //   // Get Current Date Time
  //   //   const date = new Date(0);

  //   //   // Convert EXp Time to UTC
  //   //   let tokenExpDate = date.setUTCSeconds(decoded.exp);

  //   //   // If Value of Token time greter than

  //   //   if (tokenExpDate.valueOf() > new Date().valueOf()) {
  //   //     return true;
  //   //   }

  //   //   console.log('NEW DATE ' + new Date().valueOf());
  //   //   console.log('Token DATE ' + tokenExpDate.valueOf());

  //   //   return false;
  //   // }
  //   // return false;
  // }

  // get isLoggesIn() 
  //   {
  //       return this.loginStatus.asObservable();
  //   }

  //   // get currentUserCin() 
  //   // {
  //   //     return this.cin.asObservable();
  //   // }

  // //  get currentUserRole() 
  // //   {
  // //       return this.UserRole.asObservable();
  // //   }

}
