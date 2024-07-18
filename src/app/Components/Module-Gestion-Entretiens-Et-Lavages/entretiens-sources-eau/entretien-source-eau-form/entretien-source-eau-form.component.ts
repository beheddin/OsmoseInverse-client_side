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
import { EntretienSourceEauService } from '../../../../Services/entretien-source-eau.service';
import { EntretienSourceEauInterface } from '../../../../Interfaces/entretien-source-eau.interface';
import { MessageResponseInterface } from '../../../../Interfaces/message-response.interface';
import { BassinService } from '../../../../Services/bassin.service';
import { PuitService } from '../../../../Services/puit.service';
import { BassinInterface } from '../../../../Interfaces/bassin.interface';
import { PuitInterface } from '../../../../Interfaces/puit.interface';
import { FournisseurService } from '../../../../Services/fournisseur.service';
import { FournisseurInterface } from '../../../../Interfaces/fournisseur.interface';

@Component({
  selector: 'app-entretien-source-eau-form',
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
  templateUrl: './entretien-source-eau-form.component.html',
  styleUrl: './entretien-source-eau-form.component.scss',
})
export class EntretienSourceEauFormComponent implements OnInit {
  entretienSourceEauForm: FormGroup;
  idSourceEau: string | null = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;
  bassins$!: Observable<BassinInterface[]>;
  puits$!: Observable<PuitInterface[]>;
  sourcesEau$!: Observable<any[]>;
  fournisseurs$!: Observable<FournisseurInterface[]>;

  constructor(
    private formBuilder: FormBuilder,
    private bassinService: BassinService,
    private puitService: PuitService,
    private entretienSourceEauService: EntretienSourceEauService,
    private fournisseurService: FournisseurService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.entretienSourceEauForm = this.formBuilder.group({
      nomEntretienSourceEau: [
        '',
        [Validators.required, Validators.minLength(3)],
      ],
      descriptionEntretienSourceEau: ['', Validators.required],
      chargeEntretienSourceEau: [
        null,
        [Validators.required, Validators.min(0)],
      ], //volumeEau cannot be negative
      isExternalEntretienSourceEau: [false, Validators.required],
      descriminant: [null, Validators.required],
      nomSourceEau: ['', Validators.required],
      nomFournisseur: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idSourceEau = params.get('id');
      this.isEditMode = !!this.idSourceEau;
      if (this.idSourceEau && this.isEditMode) {
        this.fetchEntretienSourceEau(this.idSourceEau);
      }
    });

    this.bassins$ = this.bassinService.getBassins();
    this.puits$ = this.puitService.getPuits();

    // this.sourcesEau$ = combineLatest([this.bassins$, this.puits$]).pipe(
    //   map(([bassins, puits]) => [...bassins, ...puits])
    // );

    this.sourcesEau$ =
      this.entretienSourceEauForm.get('descriminant')?.valueChanges.pipe(
        startWith(this.entretienSourceEauForm.get('descriminant')?.value),
        switchMap((discriminant) => {
          if (discriminant === 'BassinEntretien') {
            return this.bassins$;
          } else if (discriminant === 'PuitEntretien') {
            return this.puits$;
          } else {
            return of([]); // Return an empty array if no valid discriminant is selected
          }
        })
      ) || of([]); // Default to an empty array if 'descriminant' control is not found

    this.fournisseurs$ = this.fournisseurService.getFournisseurs();
  }

  fetchEntretienSourceEau(id: string): void {
    this.entretienSourceEauService.getEntretienSourceEauById(id).subscribe({
      next: (entretienSourceEau: EntretienSourceEauInterface) => {
        this.entretienSourceEauForm.patchValue(entretienSourceEau);
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
    if (this.entretienSourceEauForm.valid) {
      this.isLoading = true;

      let trimmedValue: string = '';

      trimmedValue = this.entretienSourceEauForm
        .get('nomSourceEau')
        ?.value.trim();
      this.entretienSourceEauForm.get('nomSourceEau')?.setValue(trimmedValue);

      //this.entretienSourceEauForm.get('descriminant')?.setValue('EntretienSourceEau');

      const formData: EntretienSourceEauInterface =
        this.entretienSourceEauForm.value;

      console.log(formData);

      if (this.isEditMode) {
        this.editEntretienSourceEau(formData);
      } else {
        this.addEntretienSourceEau(formData);
      }
    }
  }

  addEntretienSourceEau(formData: EntretienSourceEauInterface): void {
    this.entretienSourceEauService.postEntretienSourceEau(formData).subscribe({
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

  editEntretienSourceEau(formData: EntretienSourceEauInterface): void {
    if (!this.idSourceEau) return;

    this.entretienSourceEauService
      .putEntretienSourceEau(this.idSourceEau, formData)
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
    this.router.navigate(['/entretiens-sources-eau']);
    this.entretienSourceEauService.notifyEntretiensSourcesEauUpdated();
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
