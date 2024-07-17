import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MaterialModules } from '../../../../material.modules';
import { CompteFormModel } from '../../../../Models/compte-form.model';
import { RoleInterface } from '../../../../Interfaces/role.interface';
import { RoleService } from '../../../../Services/role.service';
import { FilialeInterface } from '../../../../Interfaces/filiale.interface';
import { CompteService } from '../../../../Services/compte.service';
import { FilialeService } from '../../../../Services/filiale.service';
import { MessageResponseInterface } from '../../../../Interfaces/message-response.interface';
import { PositiveNumberValidatorDirective } from '../directives/positive-number-validator.directive';
import { MinLengthNumberValidatorDirective } from '../directives/min-length-number.directive';

@Component({
  selector: 'app-compte',
  standalone: true,
  imports: [
    MaterialModules,
    FormsModule,
    RouterModule,
    NgFor,
    NgIf,
    AsyncPipe,
    JsonPipe,
    PositiveNumberValidatorDirective,
    MinLengthNumberValidatorDirective,
  ],
  templateUrl: './compte-form.component.html',
  styleUrl: './compte-form.component.scss',
})
export class CompteFormComponent implements OnInit {
  compteForm: CompteFormModel = new CompteFormModel(
    '',
    '',
    '',
    '',
    '',
    '',
    false
  ); //template-driven form

  idCompte: string | null = '';
  passwordsMatch: boolean = false;
  hidePwd: boolean = true;
  hideConfirmPwd: boolean = true;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  // @Output() formClosed = new EventEmitter<void>(); //method 2

  roles$!: Observable<RoleInterface[]>; //Observable var.
  filiales$!: Observable<FilialeInterface[]>;

  constructor(
    private compteService: CompteService,
    private roleService: RoleService,
    private filialeService: FilialeService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    // method 2
    // this.router.events
    //   .pipe(
    //     filter(
    //       (event: Event): event is NavigationEnd =>
    //         event instanceof NavigationEnd
    //     )
    //   )
    //   .subscribe((event: NavigationEnd) => {
    //     this.isFormVisible =
    //       event.url.includes('/add') || event.url.includes('/edit');
    //   });
  }

  ngOnInit(): void {
    //edit
    this.route.paramMap.subscribe((params) => {
      this.idCompte = params.get('id');
      this.isEditMode = !!this.idCompte;
      // this.isEditMode = !!params.get('id');
      //console.log(this.isEditMode);
      if (this.idCompte && this.isEditMode) this.fetchCompte(this.idCompte);
    });

    //getRoles
    this.roles$ = this.roleService.getRoles();
    // console.log(this.roles$);

    this.filiales$ = this.filialeService.getFiliales();
    // console.log(this.filiales$);

    // method 2
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     this.isFormVisible =
    //       event.url.includes('/add') || event.url.includes('/edit');
    //   }
    // });
  }

  //replaced by passwords-match.validator & passwords-match.directive
  /*Use the ngModelChange event on the confirmPassword field in the template
   to call this method which will check if the passwords match each time a character is entered in the confirmPassword field*/
  validatePasswords(): void {
    this.passwordsMatch =
      this.compteForm.password === this.compteForm.confirmPassword;
  }

  fetchCompte(id: string): void {
    this.compteService.getCompteById(id).subscribe({
      next: (compte: any) => {
        this.compteForm = compte;
      },
      error: (error: any) => {
        this.handleError(error.error.message);
      },
      complete: () => {
        this.handleComplete();
      },
    });
  }

  // method 2
  // onClick(): void {
  //   this.formClosed.emit(); //emits an event to its parent component to notify that the form should be hidden
  //   this.router.navigate(['/stations']);
  // }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      //console.log(this.compteForm);
      this.isLoading = true;

      //remove spaces from string inputs
      this.compteForm.nom = this.compteForm.nom.trim();
      this.compteForm.password = this.compteForm.password.trim();

      //convert number to string
      this.compteForm.cin = this.compteForm.cin.toString().trim();

      if (this.isEditMode) {
        this.editCompte(this.compteForm);
      } else {
        this.addCompte(this.compteForm);
      }
    }
  }

  addCompte(formData: CompteFormModel): void {
    // remove confirmPassword field from the form before sending it
    //delete formData.confirmPassword;
    const { confirmPassword, ...data } = formData;
    console.log(data);

    this.compteService.postCompte(data).subscribe({
      // next: (response: MessageResponseInterface) => {
      next: (response: MessageResponseInterface) => {
        if (response.isSuccessful) {
          this.handleSuccess(response.message);
        }
      },
      // error: (error: MessageResponseInterface) => {
      error: (error: any) => {
        this.handleError(error.error.message);
      },
      complete: () => {
        this.handleComplete();
      },
    });
  }

  editCompte(formData: CompteFormModel): void {
    if (!this.idCompte) return;

    this.compteService.putCompte(this.idCompte, formData).subscribe({
      // next: (response: MessageResponseInterface) => {
      next: (response: any) => {
        if (response.isSuccessful) {
          this.handleSuccess(response.message);
        }
      },
      // error: (error: MessageResponseInterface) => {
      error: (error: any) => {
        this.handleError(error.error.message);
      },
      complete: () => {
        this.handleComplete();
      },
    });
  }

  handleSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
    });
    this.router.navigate(['/comptes']);
    this.compteService.notifyComptesUpdated(); //refresh the comptes list
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
