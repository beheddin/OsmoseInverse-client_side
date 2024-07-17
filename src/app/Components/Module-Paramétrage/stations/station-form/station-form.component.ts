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
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MaterialModules } from '../../../../material.modules';
import { AtelierService } from '../../../../Services/atelier.service';
import { StationService } from '../../../../Services/station.service';
import { AtelierInterface } from '../../../../Interfaces/atelier.interface';
import { StationInterface } from '../../../../Interfaces/station.interface';
import { MessageResponseInterface } from '../../../../Interfaces/message-response.interface';

@Component({
  selector: 'app-station-form',
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
  templateUrl: './station-form.component.html',
  styleUrl: './station-form.component.scss',
})
export class StationFormComponent implements OnInit {
  stationForm: FormGroup;
  idStation: string | null = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;
  ateliers$!: Observable<AtelierInterface[]>;

  constructor(
    private formBuilder: FormBuilder,
    private atelierService: AtelierService,
    private stationService: StationService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.stationForm = this.formBuilder.group({
      nomStation: ['', [Validators.required, Validators.minLength(3)]],
      capaciteStation: [null, [Validators.required, Validators.min(0)]],
      typeAmmortissement: ['', [Validators.required, Validators.minLength(4)]],
      isActif: [false, Validators.required],
      nomAtelier: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Edit mode
    this.route.paramMap.subscribe((params) => {
      this.idStation = params.get('id');
      this.isEditMode = !!this.idStation;
      if (this.idStation && this.isEditMode) {
        this.fetchStation(this.idStation);
      }
    });

    this.ateliers$ = this.atelierService.getAteliers();
  }

  fetchStation(id: string): void {
    this.stationService.getStationById(id).subscribe({
      next: (station: StationInterface) => {
        this.stationForm.patchValue(station);
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
    if (this.stationForm.valid) {
      this.isLoading = true;

      // Remove spaces from text inputs
      let trimmedValue: string = '';
      //nomStation
      trimmedValue = this.stationForm.get('nomStation')?.value.trim();
      this.stationForm.get('nomStation')?.setValue(trimmedValue);

      //typeAmmortissement
      trimmedValue = this.stationForm.get('typeAmmortissement')?.value.trim();
      this.stationForm.get('typeAmmortissement')?.setValue(trimmedValue);

      //capaciteStation
      // trimmedValue = this.stationForm.get('capaciteStation')?.value.trim();
      // this.stationForm.get('capaciteStation')?.setValue(Number(trimmedValue)); //convert from string to number

      const formData: StationInterface = this.stationForm.value;

      if (this.isEditMode) {
        this.editStation(formData);
      } else {
        this.addStation(formData);
      }
    }
  }

  addStation(formData: StationInterface): void {
    this.stationService.postStation(formData).subscribe({
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

  editStation(formData: StationInterface): void {
    if (!this.idStation) return;

    this.stationService.putStation(this.idStation, formData).subscribe({
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
    this.router.navigate(['/stations']);
    this.stationService.notifyStationsUpdated(); //refresh the ateliers list
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
