import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ChangePasswordFormModel } from '../../../../Models/change-password.model';
import { CompteService } from '../../../../Services/compte.service';
import { MaterialModules } from '../../../../material.modules';
import { MessageResponseInterface } from '../../../../Interfaces/message-response.interface';

@Component({
  selector: 'app-change-password-form',
  standalone: true,
  imports: [MaterialModules, FormsModule, NgIf],
  templateUrl: './change-password-form.component.html',
  styleUrl: './change-password-form.component.scss',
})
export class ChangePasswordFormComponent implements OnInit {
  changePasswordForm: ChangePasswordFormModel = new ChangePasswordFormModel(
    '',
    '',
    ''
  );
  idCompte: string | null = '';
  hideCurrentPwd: boolean = true;
  hideNewPwd: boolean = true;
  hideNewConfirmPwd: boolean = true;
  passwordsMatch: boolean = true;
  isLoading: boolean = false;
  currentRoute: string = this.router.parseUrl(this.router.url).root.children[
    'primary'
  ].segments[0].path;

  constructor(
    private compteService: CompteService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.idCompte = this.route.snapshot.paramMap.get('id');
  }

  validatePasswords(): void {
    this.passwordsMatch =
      this.changePasswordForm.newPassword ===
      this.changePasswordForm.confirmNewPassword;
  }

  handleCloseForm(): void {
    if (this.currentRoute === 'comptes') {
      this.router.navigate(['comptes']);
    } else if (this.currentRoute === 'profile') {
      this.router.navigate(['/profile']);
    }
  }

  onSubmit(form: NgForm): void {
    if (form.valid && this.idCompte) {
      this.isLoading = true;
      // console.log(this.idCompte);
      console.log(this.changePasswordForm);

      // remove confirmPassword field from the form value, before sending the form
      const { confirmNewPassword, ...data } = this.changePasswordForm;
      console.log(data);

      this.compteService
        // .changePassword(this.idCompte, this.changePasswordForm)
        .changePassword(this.idCompte, data)
        .subscribe({
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

  //handle methods
  handleSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
    });

    const currentRoute = this.router.parseUrl(this.router.url).root.children[
      'primary'
    ].segments[0].path;
    if (currentRoute === 'comptes') {
      // console.log(currentRoute);
      this.router.navigate(['comptes']);
      this.compteService.notifyComptesUpdated(); //refresh the comptes list
    } else {
      console.log(currentRoute);
      this.router.navigate(['/profile']);
    }
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
