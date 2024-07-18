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
import { SuiviQuotidienInterface } from '../../../../Interfaces/suivi-quotidien.interface';
import { ParametreStationService } from '../../../../Services/parametre-station.service';
import { SuiviQuotidienService } from '../../../../Services/suivi-quotidien.service';
import { ParametreStationInterface } from '../../../../Interfaces/parametre-station.interface';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-suivi-quotidien-form',
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
  providers: [provideNativeDateAdapter()], //MatDatepicker
  changeDetection: ChangeDetectionStrategy.OnPush, //MatDatepicker
  templateUrl: './suivi-quotidien-form.component.html',
  styleUrl: './suivi-quotidien-form.component.scss',
})
export class SuiviQuotidienFormComponent implements OnInit {
  suiviQuotidienForm: FormGroup;
  idSuiviQuotidien: string | null = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;
  parametresStations$!: Observable<ParametreStationInterface[]>;

  constructor(
    private formBuilder: FormBuilder,
    private suiviQuotidienService: SuiviQuotidienService,
    private parametreStationService: ParametreStationService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.suiviQuotidienForm = this.formBuilder.group({
      labelSuiviQuotidien: ['', [Validators.required, Validators.minLength(3)]],
      dateSuiviQuotidien: ['', Validators.required],
      valeurSuiviQuotidien: [null, [Validators.required, Validators.min(0)]],
      labelParametreStation: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idSuiviQuotidien = params.get('id');
      this.isEditMode = !!this.idSuiviQuotidien;
      if (this.idSuiviQuotidien && this.isEditMode) {
        this.fetchSuiviQuotidienById(this.idSuiviQuotidien);
      }
    });

    this.parametresStations$ =
      this.parametreStationService.getParametresStations();
  }

  fetchSuiviQuotidienById(id: string): void {
    this.suiviQuotidienService.getSuiviQuotidienById(id).subscribe({
      next: (suiviQuotidien: SuiviQuotidienInterface) => {
        this.suiviQuotidienForm.patchValue(suiviQuotidien);
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
    if (this.suiviQuotidienForm.valid) {
      this.isLoading = true;

      let trimmedValue: string = '';

      trimmedValue = this.suiviQuotidienForm
        .get('labelSuiviQuotidien')
        ?.value.trim();
      this.suiviQuotidienForm
        .get('labelSuiviQuotidien')
        ?.setValue(trimmedValue);

      const formData: SuiviQuotidienInterface = this.suiviQuotidienForm.value;

      console.log(formData);

      if (this.isEditMode) {
        this.editSuiviQuotidien(formData);
      } else {
        this.addSuiviQuotidien(formData);
      }
    }
  }

  addSuiviQuotidien(formData: SuiviQuotidienInterface): void {
    this.suiviQuotidienService.postSuiviQuotidien(formData).subscribe({
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

  editSuiviQuotidien(formData: SuiviQuotidienInterface): void {
    if (!this.idSuiviQuotidien) return;

    this.suiviQuotidienService
      .putSuiviQuotidien(this.idSuiviQuotidien, formData)
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
    this.router.navigate(['/suivis-quotidiens']);
    this.suiviQuotidienService.notifySuivisQuotidiensUpdated();
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
