import { Component, OnInit, inject } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
// import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Emitter } from '../../emitter';
import { AuthService } from '../../Services/auth.service';
import { SidenavService } from '../../Services/sidenav.service';

@Component({
  selector: 'app-topnav',
  standalone: true,
  imports: [
    MaterialModule,
    MatIconModule,
    NgIf,
    NgFor,
    // HttpClientModule,
    RouterModule,
  ],
  templateUrl: './topnav.component.html',
  styleUrl: './topnav.component.scss',
})
export class TopnavComponent implements OnInit {
  // loginStatus: Observable<boolean> | undefined;
  // cin: Observable<string> | undefined;
  // firstName: Observable<string> | undefined;

  // userIsAuthenticated: boolean = false;
  // menuBtnIsClicked: boolean = false;
  // messageN: string = '';
  userDetails: any = null;
  menuBtnItems: string[] = ['Filiales', 'Ateliers', 'Stations'];

  authService = inject(AuthService);
  private router = inject(Router);
  private matSnackBar = inject(MatSnackBar);
  // private sidenavService = inject(SidenavService);

  constructor(private sidenavService: SidenavService) {} //private accountService: AccountService //inject the service // private httpClient: HttpClient

  ngOnInit(): void {
    //this.loginStatus = this.accountService.loginStatus;
    // this.cin = this.accountService.cin;
    // this.httpClient
    //   .get(
    //     // 'https://localhost:44386/Users/authenticatedUser',
    //     // 'http://localhost:13462/Users/authenticatedUser',
    //     'https://localhost:5001/Users/authenticatedUser',
    //     { withCredentials: true }
    //   )
    // .subscribe((res: any) => {
    //   // this.message = `Hi ${res.fullName}`;
    //   //console.log(res);
    //   this.userIsAuthenticated = true;
    // });
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
    //         console.log('next');
    //         Emitter.userIsAuthenticatedEmitter.subscribe(
    //           (isAuthenticated: boolean) => {
    //             this.userIsAuthenticated = isAuthenticated;
    //           }
    //         );
    //       },
    //       error: () => {
    //         // this.message = 'You are not logged in.';
    //         console.log('err');
    //       },
    //     })
    //   )
    //   .subscribe((res) => {
    //     console.log('res');
    //     this.message = `Hi ${res.fullName}`;
    //   });
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
    // Emitter.userIsAuthenticatedEmitter.subscribe(
    //   ({ isAuthenticated, fullName }) => {
    //     if (isAuthenticated && fullName) {
    //       this.message = `Hi, ${fullName}`;
    //     } else {
    //       this.message = ''; // Clear the message if not authenticated or no full name provided
    //     }
    //   }
    // );
    // Emitter.userIsAuthenticatedEmitter.subscribe((isAuthenticated: boolean) => {
    //   if (isAuthenticated) {
    //     this.userIsAuthenticated = true;
    //     this.httpClient
    //       .get('https://localhost:5001/Users/authenticatedUser', {
    //         withCredentials: true,
    //       })
    //       .subscribe((res: any) => {
    //         // console.log(res);
    //         this.message = `Hi ${res.fullName}`;
    //       });
    //   } else {
    //     this.userIsAuthenticated = false;
    //   }
    // });
    // Emitter.sidenavIsOpenEmitter.subscribe((isOpen: boolean) => {
    // Emitter.sidenavIsOpenEmitter.subscribe(({ isOpen }) => {
    //   this.menuBtnIsClicked = isOpen;
    // });
  }

  // isLoggedIn(): boolean {
  //   return this.authService.isLoggedIn();
  // }

  toggleSidenav() {
    this.sidenavService.toggleSidenav();
  }

  logout = () => {
    this.authService.logout();
    this.matSnackBar.open('User successfully logged out', 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
    });
    this.router.navigate(['/login']);
  };

  // //method 2
  // logout(): void {
  //   // this.authService.logout();
  //   this.authService.logout().subscribe((response: any) => {
  //     next: (response: any) => {
  //       this.matSnackBar.open(response.message, 'Close', {
  //         duration: 5000,
  //         horizontalPosition: 'center',
  //       });
  //       this.router.navigate(['/login']);
  //     }
  //   })
  // }

  // logout(): void {
  //   this.httpClient
  //     .post(
  //       // 'https://localhost:44386/Users/logout',
  //       // 'http://localhost:13462/Users/logout',
  //       'https://localhost:5001/Users/logout',
  //       {},
  //       { withCredentials: true }
  //     )
  //     .subscribe(() => {
  //       this.userIsAuthenticated = false;
  //       // this.message = '';
  //     });
  // }

  // handleMenuBtnClick(): void {
  //   //console.log('menu btn clicked');
  //   // this.menuBtnIsClicked = !this.menuBtnIsClicked;
  //   // Emitter.sidenavIsOpenEmitter.emit(this.menuBtnIsClicked);
  // }

  onMenuItemClick(item: string) {
    //console.log(`${item} menu item clicked`);
    switch (item) {
      case 'Filiales':
        this.router.navigate(['/filiales']);
        break;
      case 'Ateliers':
        this.router.navigate(['/ateliers']);
        break;
      case 'Stations':
        this.router.navigate(['/stations']);
        break;
    }
  }
}
