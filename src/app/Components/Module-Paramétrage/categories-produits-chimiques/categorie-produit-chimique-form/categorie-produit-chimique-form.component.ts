import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
import { provideNativeDateAdapter } from '@angular/material/core';

import { MaterialModules } from '../../../../material.modules';
import { MessageResponseInterface } from '../../../../Interfaces/message-response.interface';
import { CategorieProduitChimiqueInterface } from '../../../../Interfaces/categorie-produit-chimique.interface';
import { CategorieProduitChimiqueService } from '../../../../Services/categorie-produit-chimique.service';

@Component({
  selector: 'app-categorie-produit-chimique-form',
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
  templateUrl: './categorie-produit-chimique-form.component.html',
  styleUrl: './categorie-produit-chimique-form.component.scss',
})
export class CategorieProduitChimiqueFormComponent implements OnInit {
  categorieProduitChimiqueForm: FormGroup;
  idCategorieProduitChimique: string | null = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;
  categoriesProduitsChimiques$!: Observable<
    CategorieProduitChimiqueInterface[]
  >;

  constructor(
    private formBuilder: FormBuilder,
    private categorieProduitChimiqueService: CategorieProduitChimiqueService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.categorieProduitChimiqueForm = this.formBuilder.group({
      nomCategorieProduitChimique: [
        '',
        [Validators.required, Validators.minLength(3)],
      ],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idCategorieProduitChimique = params.get('id');
      this.isEditMode = !!this.idCategorieProduitChimique;
      if (this.idCategorieProduitChimique && this.isEditMode) {
        this.fetchCategorieProduitChimiqueById(this.idCategorieProduitChimique);
      }
    });
  }

  fetchCategorieProduitChimiqueById(id: string): void {
    this.categorieProduitChimiqueService
      .getCategorieProduitChimiqueById(id)
      .subscribe({
        next: (categorieProduitChimique: CategorieProduitChimiqueInterface) => {
          this.categorieProduitChimiqueForm.patchValue(
            categorieProduitChimique
          );
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
    if (this.categorieProduitChimiqueForm.valid) {
      this.isLoading = true;

      let trimmedValue: string = '';

      trimmedValue = this.categorieProduitChimiqueForm
        .get('nomCategorieProduitChimique')
        ?.value.trim();
      this.categorieProduitChimiqueForm
        .get('nomCategorieProduitChimique')
        ?.setValue(trimmedValue);

      const formData: CategorieProduitChimiqueInterface =
        this.categorieProduitChimiqueForm.value;

      console.log(formData);

      if (this.isEditMode) {
        this.editCategorieProduitChimique(formData);
      } else {
        this.addCategorieProduitChimique(formData);
      }
    }
  }

  addCategorieProduitChimique(
    formData: CategorieProduitChimiqueInterface
  ): void {
    this.categorieProduitChimiqueService
      .postCategorieProduitChimique(formData)
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

  editCategorieProduitChimique(
    formData: CategorieProduitChimiqueInterface
  ): void {
    if (!this.idCategorieProduitChimique) return;

    this.categorieProduitChimiqueService
      .putCategorieProduitChimique(this.idCategorieProduitChimique, formData)
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

  handleSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
    });
    this.router.navigate(['/categories-produits-chimiques']);
    this.categorieProduitChimiqueService.notifyCategoriesProduitsChimiquesUpdated();
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
