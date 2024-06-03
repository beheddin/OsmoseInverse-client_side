import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MaterialModule } from '../../material.module';
import { Registration } from '../../Models/registration';
import { RoleInterface } from '../../Interfaces/role.interface';
import { RoleService } from '../../Services/role.service';
import { FilialeInterface } from '../../Interfaces/filiale.interface';
import { AuthService } from '../../Services/auth.service';
import { FilialeService } from '../../Services/filiale.service';


@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    JsonPipe,
    HttpClientModule,
    RouterModule,
    NgFor,
    NgIf,
    AsyncPipe,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent implements OnInit {
  registration: Registration = new Registration('', '', '', '', '', '', '', ''); //template-driven form
  // roles: string[] = ['User', 'Admin', 'SuperAdmin'];
  passwordsMatch: boolean = false;
  hidePwd: boolean = true;
  hideConfirmPwd: boolean = true;
  loading: boolean = false;

  roles$!: Observable<RoleInterface[]>; //Observable var.
  filiales$!: Observable<FilialeInterface[]>;
  // role$!: Observable<Role>;
  // roleId!: string;

  private roleService = inject(RoleService); //inject the service
  private filialeService = inject(FilialeService); //inject the service
  private authService = inject(AuthService); //inject the service
  router = inject(Router);
  matSnackBar = inject(MatSnackBar);
  // private route = inject(ActivatedRoute);

  // constructor(private httpClient: HttpClient, private router: Router) {}

  ngOnInit(): void {
    //getRoles
    this.roles$ = this.roleService.getRoles();
    // console.log(this.roles$);

    this.filiales$ = this.filialeService.getFiliales();
    // console.log(this.filiales$);

    // //getRoleById
    // this.route.paramMap.subscribe((params) => {
    //   this.roleId = params.get('id')!;
    //   this.role$ = this.roleService.getRole(this.roleId);
    // });
  }

  onSubmit(registrationForm: any): void {
    if (registrationForm.valid) {
      this.loading = true;

      // remove confirmPassword field from the form value, before sending the form
      delete registrationForm.value.confirmPassword;
      //console.log(registrationForm.value);

      this.authService
        .registration(registrationForm.value)
        //display success/error msg after registration
        .subscribe({
          next: (response: any) => {
            console.log(response);
            this.matSnackBar.open(response.message, 'Close', {

              duration: 5000,
              horizontalPosition: 'center',
            });
            this.router.navigate(['/dashboard']);
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
            console.log('registration complete');
          },
        });
    }
    //console.log(registrationForm.value);
    //this.router.navigate(['login']);
  }

  /*Use the ngModelChange event on the confirmPassword field in the template
   to call this method which will check if the passwords match each time a character is entered in the confirmPassword field*/
  validatePasswords(): void {
    this.passwordsMatch =
      this.registration.password === this.registration.confirmPassword;
  }
}
