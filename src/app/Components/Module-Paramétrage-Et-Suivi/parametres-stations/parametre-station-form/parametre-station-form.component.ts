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
import { ParametreSuiviService } from '../../../../Services/parametre-suivi.service';
import { StationService } from '../../../../Services/station.service';
import { ParametreStationService } from '../../../../Services/parametre-station.service';
import { ParametreSuiviInterface } from '../../../../Interfaces/parametre-suivi.interface';
import { StationInterface } from '../../../../Interfaces/station.interface';
import { ParametreStationInterface } from '../../../../Interfaces/parametre-station.interface';

@Component({
  selector: 'app-parametre-station-form',
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
  templateUrl: './parametre-station-form.component.html',
  styleUrl: './parametre-station-form.component.scss',
})
export class ParametreStationFormComponent implements OnInit {
  parametreStationForm: FormGroup;
  idParametreStation: string | null = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;
  stations$!: Observable<StationInterface[]>;
  parametresSuivis$!: Observable<ParametreSuiviInterface[]>;

  constructor(
    private formBuilder: FormBuilder,

    private parametreStationService: ParametreStationService,
    private stationService: StationService,
    private parametreSuiviService: ParametreSuiviService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.parametreStationForm = this.formBuilder.group({
      labelParametreStation: [
        '',
        [Validators.required, Validators.minLength(3)],
      ],
      nomStation: ['', Validators.required],
      labelParametreSuivi: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idParametreStation = params.get('id');
      this.isEditMode = !!this.idParametreStation;
      if (this.idParametreStation && this.isEditMode) {
        this.fetchParametreStationById(this.idParametreStation);
      }
    });

    this.stations$ = this.stationService.getStations();
    this.parametresSuivis$ = this.parametreSuiviService.getParametresSuivis();
  }

  fetchParametreStationById(id: string): void {
    this.parametreStationService.getParametreStationById(id).subscribe({
      next: (parametreStation: ParametreStationInterface) => {
        this.parametreStationForm.patchValue(parametreStation);
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
    if (this.parametreStationForm.valid) {
      this.isLoading = true;

      let trimmedValue: string = '';

      trimmedValue = this.parametreStationForm
        .get('labelParametreStation')
        ?.value.trim();
      this.parametreStationForm
        .get('labelParametreStation')
        ?.setValue(trimmedValue);

      const formData: ParametreStationInterface =
        this.parametreStationForm.value;

      console.log(formData);

      if (this.isEditMode) {
        this.editParametreStation(formData);
      } else {
        this.addParametreStation(formData);
      }
    }
  }

  addParametreStation(formData: ParametreStationInterface): void {
    this.parametreStationService.postParametreStation(formData).subscribe({
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

  editParametreStation(formData: ParametreStationInterface): void {
    if (!this.idParametreStation) return;

    this.parametreStationService
      .putParametreStation(this.idParametreStation, formData)
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
    this.router.navigate(['/parametres-stations']);
    this.parametreStationService.notifyParametresStationsUpdated();
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
