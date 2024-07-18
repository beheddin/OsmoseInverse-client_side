import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MaterialModules } from '../../../../material.modules';
import { TypeEquipementInterface } from '../../../../Interfaces/type-equipement.interface';
import { TypeEquipementService } from '../../../../Services/type-equipement.service';
import { MessageResponseInterface } from '../../../../Interfaces/message-response.interface';

@Component({
  selector: 'app-type-equipement-form',
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
  templateUrl: './type-equipement-form.component.html',
  styleUrl: './type-equipement-form.component.scss',
})
export class TypeEquipementFormComponent implements OnInit {
  typeEquipementForm: FormGroup;
  idTypeEquipement: string | null = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;
  typesEquipements$!: Observable<TypeEquipementInterface[]>;

  constructor(
    private formBuilder: FormBuilder,
    private typeEquipementService: TypeEquipementService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.typeEquipementForm = this.formBuilder.group({
      labelTypeEquipement: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idTypeEquipement = params.get('id');
      this.isEditMode = !!this.idTypeEquipement;
      if (this.idTypeEquipement && this.isEditMode) {
        this.fetchTypeEquipement(this.idTypeEquipement);
      }
    });

    this.typesEquipements$ = this.typeEquipementService.getTypesEquipements();
  }

  fetchTypeEquipement(id: string): void {
    this.typeEquipementService.getTypeEquipementById(id).subscribe({
      next: (typeEquipement: TypeEquipementInterface) => {
        this.typeEquipementForm.patchValue(typeEquipement);
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
    if (this.typeEquipementForm.valid) {
      this.isLoading = true;

      let trimmedValue: string = '';

      trimmedValue = this.typeEquipementForm
        .get('labelTypeEquipement')
        ?.value.trim();
      this.typeEquipementForm
        .get('labelTypeEquipement')
        ?.setValue(trimmedValue);

      const formData: TypeEquipementInterface = this.typeEquipementForm.value;

      console.log(formData);

      if (this.isEditMode) {
        this.editEquipement(formData);
      } else {
        this.addEquipement(formData);
      }
    }
  }

  addEquipement(formData: TypeEquipementInterface): void {
    this.typeEquipementService.postTypeEquipement(formData).subscribe({
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

  editEquipement(formData: TypeEquipementInterface): void {
    if (!this.idTypeEquipement) return;

    this.typeEquipementService
      .putTypeEquipement(this.idTypeEquipement, formData)
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
    this.router.navigate(['/types-equipements']);
    this.typeEquipementService.notifyTypesEquipementsUpdated();
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
