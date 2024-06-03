import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';

import { MaterialModule } from '../../material.module';
import { Login } from '../../Models/login';
import { AuthService } from '../../Services/auth.service';
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
  login: Login = new Login('', ''); //template-driven form
  hidePwd: boolean = true;
  loading: boolean = false;

  //dependencies injection
  private authService = inject(AuthService); //inject the service
  private matSnackBar = inject(MatSnackBar); //display success/error msg after login
  private router = inject(Router);

  // constructor(
  //   private authService: AuthService,
  //   private matSnackBar: MatSnackBar,
  //   private router: Router
  // ) {}

  onSubmit(loginForm: any): void {
    if (loginForm.valid) {
      this.loading = true;

      this.authService
        .login(loginForm.value)
        // .pipe(
        //   tap((response: any) => console.log(response)),
        //   takeUntil(this.destroy$)
        // )
        //display success/error msg after login
        .subscribe({
          next: (response: any) => {
            console.log(response);

            // Check if the login was successful
            //if (response.isSuccessful) {
            this.matSnackBar.open(response.message, 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
            });
            this.router.navigate(['/dashboard']);
            //}
          },
          error: (error: any) => {
            this.matSnackBar.open(error.error.message, 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
            });
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
            console.log('login complete');
          },
        });
      // console.log(loginForm.value);
    }
  }
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
