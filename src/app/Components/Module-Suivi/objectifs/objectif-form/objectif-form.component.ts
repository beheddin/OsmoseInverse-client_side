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
// import {
//   DateAdapter,
//   MAT_DATE_FORMATS,
//   MatNativeDateModule,
//   provideNativeDateAdapter,
// } from '@angular/material/core';
import { ObjectifInterface } from '../../../../Interfaces/objectif.interface';
import { ObjectifService } from '../../../../Services/objectif.service';
import { StationInterface } from '../../../../Interfaces/station.interface';
import { StationService } from '../../../../Services/station.service';
// import {
//   MAT_DATE_FORMATS,
//   MAT_DATE_LOCALE,
//   provideNativeDateAdapter,
// } from '@angular/material/core';
import { YEAR_DATE_FORMATS, YearDateAdapter } from '../year-date-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
// import { CustomDateAdapter } from '../custom-date-adapter';
// import { CUSTOM_DATE_FORMATS } from '../custom-date-formats';

@Component({
  selector: 'app-objectif-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MaterialModules,
    RouterModule,
    NgFor,
    NgIf,
    AsyncPipe,
    JsonPipe,
    // MatNativeDateModule,
  ],
  // providers: [provideNativeDateAdapter()], //MatDatepicker
  // changeDetection: ChangeDetectionStrategy.OnPush, //MatDatepicker
  // providers: [
  //   { provide: DateAdapter, useClass: CustomDateAdapter },
  //   { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  // ],
  providers: [
    { provide: DateAdapter, useClass: YearDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: YEAR_DATE_FORMATS },
  ],
  templateUrl: './objectif-form.component.html',
  styleUrl: './objectif-form.component.scss',
})
export class ObjectifFormComponent implements OnInit {
  objectifForm: FormGroup;
  idObjectif: string | null = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;
  stations$!: Observable<StationInterface[]>;

  constructor(
    private formBuilder: FormBuilder,
    private objectifService: ObjectifService,
    private stationService: StationService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.objectifForm = this.formBuilder.group({
      labelObjectif: ['', [Validators.required, Validators.minLength(3)]],
      annee: ['', Validators.required],
      tdSeauBrute: [null, [Validators.required, Validators.min(0)]],
      tdSeauOsmosee: [null, [Validators.required, Validators.min(0)]],
      rendementMembranes: [null, [Validators.required, Validators.min(0)]],
      rendement: [null, [Validators.required, Validators.min(0)]],
      permanentFlow: [null, [Validators.required, Validators.min(0)]],
      tauxExploitation: [null, [Validators.required, Validators.min(0)]],
      deltaPMicrofiltre: [null, [Validators.required, Validators.min(0)]],
      deltaPMembrane: [null, [Validators.required, Validators.min(0)]],
      deltaPSable: [null, [Validators.required, Validators.min(0)]],
      cout: [null, [Validators.required, Validators.min(0)]],
      th: [null, [Validators.required, Validators.min(0)]],
      ph: [null, [Validators.required, Validators.min(0)]],
      tauxChlorure: [null, [Validators.required, Validators.min(0)]],
      nomStation: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idObjectif = params.get('id');
      this.isEditMode = !!this.idObjectif;
      if (this.idObjectif && this.isEditMode) {
        this.fetchObjectifById(this.idObjectif);
      }
    });

    this.stations$ = this.stationService.getStations();
  }

  fetchObjectifById(id: string): void {
    this.objectifService.getObjectifById(id).subscribe({
      next: (objectif: ObjectifInterface) => {
        this.objectifForm.patchValue(objectif);
      },
      error: (error: any) => {
        this.handleError(error.error.message);
      },
      complete: () => {
        this.handleComplete();
      },
    });
  }

  chosenYearHandler(normalizedYear: Date, datepicker: any) {
    const ctrlValue = this.objectifForm.get('annee')?.value || new Date();
    ctrlValue.setFullYear(normalizedYear.getFullYear());
    this.objectifForm.get('annee')?.setValue(ctrlValue);
    datepicker.close();
  }

  onSubmit(): void {
    if (this.objectifForm.valid) {
      this.isLoading = true;

      let trimmedValue: string = '';

      trimmedValue = this.objectifForm.get('labelObjectif')?.value.trim();
      this.objectifForm.get('labelObjectif')?.setValue(trimmedValue);

      const formData: ObjectifInterface = this.objectifForm.value;

      console.log(formData);

      if (this.isEditMode) {
        this.editObjectif(formData);
      } else {
        this.addObjectif(formData);
      }
    }
  }

  addObjectif(formData: ObjectifInterface): void {
    this.objectifService.postObjectif(formData).subscribe({
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

  editObjectif(formData: ObjectifInterface): void {
    if (!this.idObjectif) return;

    this.objectifService.putObjectif(this.idObjectif, formData).subscribe({
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
    this.router.navigate(['/objectifs']);
    this.objectifService.notifyObjectifsUpdated();
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
