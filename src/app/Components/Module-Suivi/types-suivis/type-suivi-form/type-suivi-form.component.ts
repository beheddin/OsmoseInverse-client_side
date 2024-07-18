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
import { MessageResponseInterface } from '../../../../Interfaces/message-response.interface';
import { TypeSuiviInterface } from '../../../../Interfaces/type-suivi.interface';
import { TypeSuiviService } from '../../../../Services/type-suivi.service';

@Component({
  selector: 'app-type-suivi-form',
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
  templateUrl: './type-suivi-form.component.html',
  styleUrl: './type-suivi-form.component.scss',
})
export class TypeSuiviFormComponent implements OnInit {
  typeSuiviForm: FormGroup;
  idTypeSuivi: string | null = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;
  typesSuivis$!: Observable<TypeSuiviInterface[]>;

  constructor(
    private formBuilder: FormBuilder,
    private typeSuiviService: TypeSuiviService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.typeSuiviForm = this.formBuilder.group({
      labelTypeSuivi: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idTypeSuivi = params.get('id');
      this.isEditMode = !!this.idTypeSuivi;
      if (this.idTypeSuivi && this.isEditMode) {
        this.fetchTypeSuiviById(this.idTypeSuivi);
      }
    });

    this.typesSuivis$ = this.typeSuiviService.getTypesSuivis();
  }

  fetchTypeSuiviById(id: string): void {
    this.typeSuiviService.getTypeSuiviById(id).subscribe({
      next: (typeSuivi: TypeSuiviInterface) => {
        this.typeSuiviForm.patchValue(typeSuivi);
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
    if (this.typeSuiviForm.valid) {
      this.isLoading = true;

      let trimmedValue: string = '';

      trimmedValue = this.typeSuiviForm.get('labelTypeSuivi')?.value.trim();
      this.typeSuiviForm.get('labelTypeSuivi')?.setValue(trimmedValue);

      const formData: TypeSuiviInterface = this.typeSuiviForm.value;

      console.log(formData);

      if (this.isEditMode) {
        this.editTypeSuivi(formData);
      } else {
        this.addTypeSuivi(formData);
      }
    }
  }

  addTypeSuivi(formData: TypeSuiviInterface): void {
    this.typeSuiviService.postTypeSuivi(formData).subscribe({
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

  editTypeSuivi(formData: TypeSuiviInterface): void {
    if (!this.idTypeSuivi) return;

    this.typeSuiviService.putTypeSuivi(this.idTypeSuivi, formData).subscribe({
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
    this.router.navigate(['/types-suivis']);
    this.typeSuiviService.notifyTypesSuivisUpdated();
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
