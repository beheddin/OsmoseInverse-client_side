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
import { StationInterface } from '../../../../Interfaces/station.interface';
import { UniteInterface } from '../../../../Interfaces/unite.interface';
import { TypeMembraneInterface } from '../../../../Interfaces/type-membrane.interface';
import { MembraneService } from '../../../../Services/membrane.service';
import { StationService } from '../../../../Services/station.service';
import { UniteService } from '../../../../Services/unite.service';
import { TypeMembraneService } from '../../../../Services/type-membrane.service';
import { MembraneInterface } from '../../../../Interfaces/membrane.interface';

@Component({
  selector: 'app-membrane-form',
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
  templateUrl: './membrane-form.component.html',
  styleUrl: './membrane-form.component.scss',
})
export class MembraneFormComponent implements OnInit {
  membraneForm: FormGroup;
  idMembrane: string | null = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;
  stations$!: Observable<StationInterface[]>;
  unites$!: Observable<UniteInterface[]>;
  typesMembranes$!: Observable<TypeMembraneInterface[]>;

  constructor(
    private formBuilder: FormBuilder,

    private membraneService: MembraneService,
    private stationService: StationService,
    private uniteService: UniteService,
    private typeMembraneService: TypeMembraneService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.membraneForm = this.formBuilder.group({
      labelProduitConsommable: [
        '',
        [Validators.required, Validators.minLength(3)],
      ],
      quantiteProduitConsommable: [
        null,
        [Validators.required, Validators.min(0)],
      ], //volumeEau cannot be negative
      dateUtilisationProduitConsommable: ['', Validators.required],
      nomStation: ['', Validators.required],
      labelUnite: ['', Validators.required],
      labelTypeMembrane: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idMembrane = params.get('id');
      this.isEditMode = !!this.idMembrane;
      if (this.idMembrane && this.isEditMode) {
        this.fetchMembrane(this.idMembrane);
      }
    });

    this.stations$ = this.stationService.getStations();
    this.unites$ = this.uniteService.getUnites();
    this.typesMembranes$ = this.typeMembraneService.getTypesMembranes();
  }

  fetchMembrane(id: string): void {
    this.membraneService.getMembraneById(id).subscribe({
      next: (membrane: MembraneInterface) => {
        this.membraneForm.patchValue(membrane);
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
    if (this.membraneForm.valid) {
      this.isLoading = true;

      let trimmedValue: string = '';

      trimmedValue = this.membraneForm
        .get('labelProduitConsommable')
        ?.value.trim();
      this.membraneForm.get('labelProduitConsommable')?.setValue(trimmedValue);

      const formData: MembraneInterface = this.membraneForm.value;

      console.log(formData);

      if (this.isEditMode) {
        this.editMembrane(formData);
      } else {
        this.addMembrane(formData);
      }
    }
  }

  addMembrane(formData: MembraneInterface): void {
    this.membraneService.postMembrane(formData).subscribe({
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

  editMembrane(formData: MembraneInterface): void {
    if (!this.idMembrane) return;

    this.membraneService.putMembrane(this.idMembrane, formData).subscribe({
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
    this.router.navigate(['/membranes']);
    this.membraneService.notifyMembranesUpdated();
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
