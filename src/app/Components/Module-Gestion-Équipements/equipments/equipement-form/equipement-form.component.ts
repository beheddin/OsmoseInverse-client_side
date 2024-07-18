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
import { EquipementInterface } from '../../../../Interfaces/equipement.interface';
import { MessageResponseInterface } from '../../../../Interfaces/message-response.interface';
import { StationService } from '../../../../Services/station.service';
import { NatureEquipementService } from '../../../../Services/nature-equipement.service';
import { TypeEquipementService } from '../../../../Services/type-equipement.service';
import { StationInterface } from '../../../../Interfaces/station.interface';
import { NatureEquipementInterface } from '../../../../Interfaces/nature-equipement.interface';
import { EquipementService } from '../../../../Services/equipement.service';
import { TypeEquipementInterface } from '../../../../Interfaces/type-equipement.interface';

@Component({
  selector: 'app-equipement-form',
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
  templateUrl: './equipement-form.component.html',
  styleUrl: './equipement-form.component.scss',
})
export class EquipementFormComponent implements OnInit {
  equipementForm: FormGroup;
  idEquipement: string | null = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;
  stations$!: Observable<StationInterface[]>;
  naturesEquipements$!: Observable<NatureEquipementInterface[]>;
  typesEquipements$!: Observable<TypeEquipementInterface[]>;

  constructor(
    private formBuilder: FormBuilder,
    private equipementService: EquipementService,
    private stationService: StationService,
    private naturesEquipementService: NatureEquipementService,
    private typeEquipementService: TypeEquipementService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.equipementForm = this.formBuilder.group({
      labelEquipement: ['', [Validators.required, Validators.minLength(3)]],
      nomStation: ['', Validators.required],
      labelNatureEquipement: ['', Validators.required],
      labelTypeEquipement: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idEquipement = params.get('id');
      this.isEditMode = !!this.idEquipement;
      if (this.idEquipement && this.isEditMode) {
        this.fetchEquipement(this.idEquipement);
      }
    });

    this.stations$ = this.stationService.getStations();

    this.naturesEquipements$ =
      this.naturesEquipementService.getNaturesEquipements();
    this.typesEquipements$ = this.typeEquipementService.getTypesEquipements();
  }

  fetchEquipement(id: string): void {
    this.equipementService.getEquipementById(id).subscribe({
      next: (equipement: EquipementInterface) => {
        this.equipementForm.patchValue(equipement);
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
    if (this.equipementForm.valid) {
      this.isLoading = true;

      let trimmedValue: string = '';

      trimmedValue = this.equipementForm.get('nomEquipement')?.value.trim();
      this.equipementForm.get('nomEquipement')?.setValue(trimmedValue);

      const formData: EquipementInterface = this.equipementForm.value;

      console.log(formData);

      if (this.isEditMode) {
        this.editEquipement(formData);
      } else {
        this.addEquipement(formData);
      }
    }
  }

  addEquipement(formData: EquipementInterface): void {
    this.equipementService.postEquipement(formData).subscribe({
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

  editEquipement(formData: EquipementInterface): void {
    if (!this.idEquipement) return;

    this.equipementService
      .putEquipement(this.idEquipement, formData)
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
    this.router.navigate(['/equipements']);
    this.equipementService.notifyEquipementsUpdated();
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
