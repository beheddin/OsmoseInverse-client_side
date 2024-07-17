import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
import { ParametreSuiviService } from '../../../../Services/parametre-suivi.service';
import { TypeSuiviService } from '../../../../Services/type-suivi.service';
import { ParametreSuiviInterface } from '../../../../Interfaces/parametre-suivi.interface';

@Component({
  selector: 'app-parametre-suivi-form',
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
  templateUrl: './parametre-suivi-form.component.html',
  styleUrl: './parametre-suivi-form.component.scss',
})
export class ParametreSuiviFormComponent implements OnInit {
  parametreSuiviForm: FormGroup;
  idParametreSuivi: string | null = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;
  typesSuivis$!: Observable<TypeSuiviInterface[]>;

  constructor(
    private formBuilder: FormBuilder,
    private parametreSuiviService: ParametreSuiviService,
    private typeSuiviService: TypeSuiviService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.parametreSuiviForm = this.formBuilder.group({
      labelParametreSuivi: ['', [Validators.required, Validators.minLength(3)]],
      labelTypeSuivi: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idParametreSuivi = params.get('id');
      this.isEditMode = !!this.idParametreSuivi;
      if (this.idParametreSuivi && this.isEditMode) {
        this.fetchParametreSuiviById(this.idParametreSuivi);
      }
    });

    this.typesSuivis$ = this.typeSuiviService.getTypesSuivis();
  }

  fetchParametreSuiviById(id: string): void {
    this.parametreSuiviService.getParametreSuiviById(id).subscribe({
      next: (parametreSuivi: ParametreSuiviInterface) => {
        this.parametreSuiviForm.patchValue(parametreSuivi);
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
    if (this.parametreSuiviForm.valid) {
      this.isLoading = true;

      let trimmedValue: string = '';

      trimmedValue = this.parametreSuiviForm
        .get('labelParametreSuivi')
        ?.value.trim();
      this.parametreSuiviForm
        .get('labelParametreSuivi')
        ?.setValue(trimmedValue);

      const formData: ParametreSuiviInterface = this.parametreSuiviForm.value;

      console.log(formData);

      if (this.isEditMode) {
        this.editParametreSuivi(formData);
      } else {
        this.addParametreSuivi(formData);
      }
    }
  }

  addParametreSuivi(formData: ParametreSuiviInterface): void {
    this.parametreSuiviService.postParametreSuivi(formData).subscribe({
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

  editParametreSuivi(formData: ParametreSuiviInterface): void {
    if (!this.idParametreSuivi) return;

    this.parametreSuiviService
      .putParametreSuivi(this.idParametreSuivi, formData)
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
    this.router.navigate(['/parametres-suivis']);
    this.parametreSuiviService.notifyParametresSuivisUpdated();
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
