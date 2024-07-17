import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe, NgIf, NgClass } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';

import { MaterialModules } from '../../material.modules';
import { LoginFormModel } from '../../Models/login-form.model';
import { AuthService } from '../../Services/auth.service';
import { MessageResponseInterface } from '../../Interfaces/message-response.interface';
// import { Emitter } from '../../emitter';
// import { response } from 'express';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MaterialModules,

    FormsModule, // If using template-driven forms
    //ReactiveFormsModule, // If using reactive forms
    JsonPipe,
    RouterModule,
    NgIf,
    NgClass,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginFormModel: LoginFormModel = new LoginFormModel('', ''); //template-driven form
  hidePwd: boolean = true;
  isLoading: boolean = false;

  // private authService = inject(AuthService);
  // private snackBar = inject(MatSnackBar);
  // private router = inject(Router);

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  onSubmit(loginForm: any): void {
    if (loginForm.valid) {
      this.isLoading = true;

      this.authService.login(loginForm.value).subscribe({
        next: (response: MessageResponseInterface) => {
          if (response.isSuccessful) {
            this.handleSuccess(response.message);
          }
        },
        error: (error: any) => {
          this.handleError(error.error.message);
        },
        complete: () => {
          this.handleComplete();
        },
      });
    }
  }

  handleSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
    });
    this.router.navigate(['dashboard']);
  }

  handleError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
    });
    this.isLoading = false;
  }

  handleComplete(): void {
    this.isLoading = false;
    console.log('operation complete');
  }
}
