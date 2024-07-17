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
import { StationService } from '../../../../Services/station.service';
import { EntretienStationService } from '../../../../Services/entretien-station.service';
import { FournisseurInterface } from '../../../../Interfaces/fournisseur.interface';
import { StationInterface } from '../../../../Interfaces/station.interface';
import { FournisseurService } from '../../../../Services/fournisseur.service';
import { EntretienStationInterface } from '../../../../Interfaces/entretien-station.interface';
import { MessageResponseInterface } from '../../../../Interfaces/message-response.interface';

@Component({
  selector: 'app-entretien-station-form',
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
  templateUrl: './entretien-station-form.component.html',
  styleUrl: './entretien-station-form.component.scss',
})
export class EntretienStationFormComponent implements OnInit {
  entretienStationForm: FormGroup;
  idStation: string | null = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;
  stations$!: Observable<StationInterface[]>;
  fournisseurs$!: Observable<FournisseurInterface[]>;

  constructor(
    private formBuilder: FormBuilder,
    private entretienStationService: EntretienStationService,
    private stationService: StationService,
    private fournisseurService: FournisseurService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.entretienStationForm = this.formBuilder.group({
      nomEntretienStation: ['', [Validators.required, Validators.minLength(3)]],
      descriptionEntretienStation: ['', Validators.required],
      chargeEntretienStation: [null, [Validators.required, Validators.min(0)]], //chargeEntretienStation cannot be negative
      isExternalEntretienStation: [false, Validators.required],
      nomStation: ['', Validators.required],
      nomFournisseur: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idStation = params.get('id');
      this.isEditMode = !!this.idStation;
      if (this.idStation && this.isEditMode) {
        this.fetchEntretienStation(this.idStation);
      }
    });

    this.stations$ = this.stationService.getStations();
    this.fournisseurs$ = this.fournisseurService.getFournisseurs();
  }

  fetchEntretienStation(id: string): void {
    this.entretienStationService.getEntretienStationById(id).subscribe({
      next: (entretienStation: EntretienStationInterface) => {
        this.entretienStationForm.patchValue(entretienStation);
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
    if (this.entretienStationForm.valid) {
      this.isLoading = true;

      let trimmedValue: string = '';

      trimmedValue = this.entretienStationForm
        .get('nomEntretienStation')
        ?.value.trim();
      this.entretienStationForm
        .get('nomEntretienStation')
        ?.setValue(trimmedValue);

      const formData: EntretienStationInterface =
        this.entretienStationForm.value;

      console.log(formData);

      if (this.isEditMode) {
        this.editEntretienStation(formData);
      } else {
        this.addEntretienStation(formData);
      }
    }
  }

  addEntretienStation(formData: EntretienStationInterface): void {
    this.entretienStationService.postEntretienStation(formData).subscribe({
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

  editEntretienStation(formData: EntretienStationInterface): void {
    if (!this.idStation) return;

    this.entretienStationService
      .putEntretienStation(this.idStation, formData)
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
    this.router.navigate(['/entretiens-stations']);
    this.entretienStationService.notifyEntretiensStationsUpdated();
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
