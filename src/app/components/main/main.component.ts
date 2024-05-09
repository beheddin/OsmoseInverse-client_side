import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgFor } from '@angular/common';
import { tap } from 'rxjs/operators';

import { Emitter } from '../../emitter';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MaterialModule, NgFor, HttpClientModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  isSidenavOpen: boolean;
  menu: string[] = ['Station', 'Unité', 'Atelier'];
  // message: string = '';

  constructor(private httpClient: HttpClient) {
    this.isSidenavOpen = false;
  }

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
    //         // console.log(res);

    //         Emitter.userIsAuthenticatedEmitter.emit(true); //if the user is authenticated, we emit an event with the value true
    //       },
    //       error: (err) => {
    //         this.message = 'You are not logged in.';
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

    Emitter.sidenavIsOpenEmitter.subscribe((menuBtnIsClicked: boolean) => {
      this.isSidenavOpen = menuBtnIsClicked;
    });
  }
}
