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
import { ProduitChimiqueService } from '../../../../Services/produit-chimique.service';
import { StationService } from '../../../../Services/station.service';
import { LavageChimiqueService } from '../../../../Services/lavage-chimique.service';
import { StationInterface } from '../../../../Interfaces/station.interface';
import { ProduitChimiqueInterface } from '../../../../Interfaces/produit-chimique.interface';
import { LavageChimiqueInterface } from '../../../../Interfaces/lavage-chimique.interface';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-lavage-chimique-form',
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
  templateUrl: './lavage-chimique-form.component.html',
  styleUrl: './lavage-chimique-form.component.scss',
})
export class LavageChimiqueFormComponent implements OnInit {
  lavageChimiqueForm: FormGroup;
  idLavageChimique: string | null = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;
  produitsChimiques$!: Observable<ProduitChimiqueInterface[]>;
  stations$!: Observable<StationInterface[]>;

  constructor(
    private formBuilder: FormBuilder,
    private lavageChimiqueService: LavageChimiqueService,
    private produitChimiqueService: ProduitChimiqueService,
    private stationService: StationService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.lavageChimiqueForm = this.formBuilder.group({
      nomLavageChimique: ['', [Validators.required, Validators.minLength(3)]],
      dateLavageChimique: ['', Validators.required],
      labelProduitChimique: ['', Validators.required],
      nomStation: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idLavageChimique = params.get('id');
      this.isEditMode = !!this.idLavageChimique;
      if (this.idLavageChimique && this.isEditMode) {
        this.fetchLavageChimiqueById(this.idLavageChimique);
      }
    });

    this.stations$ = this.stationService.getStations();
    this.produitsChimiques$ =
      this.produitChimiqueService.getProduitsChimiques();
  }

  fetchLavageChimiqueById(id: string): void {
    this.lavageChimiqueService.getLavageChimiqueById(id).subscribe({
      next: (lavageChimique: LavageChimiqueInterface) => {
        this.lavageChimiqueForm.patchValue(lavageChimique);
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
    if (this.lavageChimiqueForm.valid) {
      this.isLoading = true;

      let trimmedValue: string = '';

      trimmedValue = this.lavageChimiqueForm
        .get('nomLavageChimique')
        ?.value.trim();
      this.lavageChimiqueForm.get('nomLavageChimique')?.setValue(trimmedValue);

      const formData: LavageChimiqueInterface = this.lavageChimiqueForm.value;

      console.log(formData);

      if (this.isEditMode) {
        this.editLavageChimique(formData);
      } else {
        this.addLavageChimique(formData);
      }
    }
  }

  addLavageChimique(formData: LavageChimiqueInterface): void {
    this.lavageChimiqueService.postLavageChimique(formData).subscribe({
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

  editLavageChimique(formData: LavageChimiqueInterface): void {
    if (!this.idLavageChimique) return;

    this.lavageChimiqueService
      .putLavageChimique(this.idLavageChimique, formData)
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
    this.router.navigate(['/lavages-chimiques']);
    this.lavageChimiqueService.notifyLavagesChimiquesUpdated();
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
