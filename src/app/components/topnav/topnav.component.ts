import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { Emitter } from '../../emitter';

@Component({
  selector: 'app-topnav',
  standalone: true,
  imports: [MaterialModule, MatIcon, NgIf, HttpClientModule, RouterModule],
  templateUrl: './topnav.component.html',
  styleUrl: './topnav.component.scss',
})
export class TopnavComponent implements OnInit, OnChanges {
  // userIsAuthenticated: boolean = false;
  @Input() userIsAuthenticated: boolean = false;

  menuBtnIsClicked: boolean = false;
  // @Input() message: string = '';
  message: string = '';

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    // //displays the name of the authenticated user in the topnav
    // this.httpClient
    //   .get(
    //     // 'https://localhost:44386/Users/authenticatedUser',
    //     // 'http://localhost:13462/Users/authenticatedUser',
    //     'https://localhost:5001/Users/authenticatedUser',
    //     { withCredentials: true }
    //   )
    //   .pipe(
    //     tap({
    //       next: (res: any) => {
    //         this.message = `Hi ${res.fullName}`;
    //         console.log(res);

    //         Emitter.userIsAuthenticatedEmitter.emit(true); //if the user is authenticated, we emit an event with the value true
    //       },
    //       error: (err) => {
    //         // this.message = 'You are not logged in.';
    //         //console.log(err);

    //         Emitter.userIsAuthenticatedEmitter.emit(false); //if the user is not authenticated, we emit an event with the value false
    //       },
    //     })
    //   )
    //   .subscribe();

    /*the below code is depracated and replaced by the code above*/
    // .subscribe(
    //   (res: any) => {
    //     this.message = `Hi ${res.fullName}`;
    //     console.log(res);

    //     Emitters.authEmitter.emit(true);
    //   },
    //   (err) => {
    //     this.message = 'You are not logged in.';
    //     console.log(err);

    //     Emitters.authEmitter.emit(false);
    //   }
    // );

    Emitter.userIsAuthenticatedEmitter.subscribe((isAuthenticated: boolean) => {
      this.userIsAuthenticated = isAuthenticated;
    });

    Emitter.sidenavIsOpenEmitter.subscribe((btnIsClicked: boolean) => {
      this.menuBtnIsClicked = btnIsClicked;
    });
  }

  ngOnChanges(): void {
    console.log('ngOnChanges');
    console.log(this.userIsAuthenticated);
  }

  logout(): void {
    this.httpClient
      .post(
        // 'https://localhost:44386/Users/logout',
        // 'http://localhost:13462/Users/logout',
        'https://localhost:5001/Users/logout',
        {},
        { withCredentials: true }
      )
      .subscribe(() => {
        this.userIsAuthenticated = false;
      });
  }

  handleMenuBtnClick(): void {
    //console.log('menu btn clicked');
    this.menuBtnIsClicked = !this.menuBtnIsClicked;

    Emitter.sidenavIsOpenEmitter.emit(this.menuBtnIsClicked);
  }
}
