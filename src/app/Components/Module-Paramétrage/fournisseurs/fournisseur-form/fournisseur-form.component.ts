import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { Observable, combineLatest, of } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MaterialModules } from '../../../../material.modules';
import { FournisseurService } from '../../../../Services/fournisseur.service';
import { FournisseurInterface } from '../../../../Interfaces/fournisseur.interface';
import { MessageResponseInterface } from '../../../../Interfaces/message-response.interface';

@Component({
  selector: 'app-fournisseur-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MaterialModules,
    RouterModule,
    NgFor,
    NgIf,
    AsyncPipe,
    JsonPipe,
  ],
  templateUrl: './fournisseur-form.component.html',
  styleUrl: './fournisseur-form.component.scss',
})
export class FournisseurFormComponent implements OnInit {
  fournisseurForm: FormGroup;
  idStation: string | null = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;
  fournisseurs$!: Observable<FournisseurInterface[]>;

  constructor(
    private formBuilder: FormBuilder,
    private fournisseurService: FournisseurService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.fournisseurForm = this.formBuilder.group({
      nomFournisseur: ['', [Validators.required, Validators.minLength(3)]],
      numTelFournisseur: ['', Validators.required],
      numFaxFournisseur: ['', Validators.required],
      emailFournisseur: ['', Validators.required],
      addresseFournisseur: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idStation = params.get('id');
      this.isEditMode = !!this.idStation;
      if (this.idStation && this.isEditMode) {
        this.fetchFournisseur(this.idStation);
      }
    });

    this.fournisseurs$ = this.fournisseurService.getFournisseurs();
  }

  fetchFournisseur(id: string): void {
    this.fournisseurService.getFournisseurById(id).subscribe({
      next: (fournisseur: FournisseurInterface) => {
        this.fournisseurForm.patchValue(fournisseur);
      },
      error: (error: any) => {
        this.handleError(error.error.message);
      },
      complete: () => {
        this.handleComplete();
      },
    });
  }

  onSubmit(): void {
    if (this.fournisseurForm.valid) {
      this.isLoading = true;

      let trimmedValue: string = '';

      trimmedValue = this.fournisseurForm.get('nomFournisseur')?.value.trim();
      this.fournisseurForm.get('nomFournisseur')?.setValue(trimmedValue);

      const formData: FournisseurInterface = this.fournisseurForm.value;

      console.log(formData);

      if (this.isEditMode) {
        this.editFournisseur(formData);
      } else {
        this.addFournisseur(formData);
      }
    }
  }

  addFournisseur(formData: FournisseurInterface): void {
    this.fournisseurService.postFournisseur(formData).subscribe({
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

  editFournisseur(formData: FournisseurInterface): void {
    if (!this.idStation) return;

    this.fournisseurService.putFournisseur(this.idStation, formData).subscribe({
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

  handleSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
    });
    this.router.navigate(['/fournisseurs']);
    this.fournisseurService.notifyFournisseursUpdated();
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
