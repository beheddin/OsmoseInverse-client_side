import { Component, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { MaterialModule } from '../../material.module';
import { Login } from '../../models/login';
import { AuthService } from '../../services/auth.service';
// import { Emitter } from '../../emitter';
// import { response } from 'express';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MaterialModule,

    FormsModule, // If using template-driven forms
    //ReactiveFormsModule, // If using reactive forms
    JsonPipe,
    RouterModule,
    NgIf,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public hidePwd: boolean = true;
  public login: Login = new Login('', ''); //template-driven form

  //Ensure to unsubscribe from the observable to avoid memory leaks. This can be done using the takeUntil operator with a Subject.
  // private destroy$ = new Subject<void>();

  // //dependencies injection
  // authService = inject(AuthService); //inject the service
  // matSnackBar = inject(MatSnackBar); //display success/error msg after login
  // router = inject(Router);

  constructor(
    private authService: AuthService,
    private matSnackBar: MatSnackBar,
    private router: Router
  ) {}

  onSubmit(loginForm: any): void {
    if (loginForm.valid) {
      this.authService
        .login(loginForm.value)
        // .pipe(
        //   tap((response: any) => console.log(response)),
        //   takeUntil(this.destroy$)
        // )
        //display success/error msg after login
        .subscribe({
          next: (response: any) => {
            //console.log(response);
            this.matSnackBar.open(response.message, 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
            });
            this.router.navigate(['']);
          },
          error: (error: any) => {
            this.matSnackBar.open(error.error.message, 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
            });
          },
        });
      // console.log(loginForm.value);
    }
  }

  // ngOnDestroy() {
  //   this.destroy$.next();
  //   this.destroy$.complete();
  // }
}
// submit(form: any) {
//   // console.log(form.value);
//   this.httpClient
//     .post(
//       //'https://localhost:44386/Users/login',
//       'https://localhost:5001/Users/login',
//       form.value,
//       {
//         withCredentials: true,
//       }
//     )
//     .subscribe((res: any) => {
//       // Emit an event with the user's name upon successful login
//       Emitter.userIsAuthenticatedEmitter.emit(true);

//       // Navigate to the desired route after successful login
//       this.router.navigate(['']);
//     });
// }
