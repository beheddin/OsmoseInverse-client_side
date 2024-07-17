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
import { ProduitChimiqueInterface } from '../../../../Interfaces/produit-chimique.interface';
import { DosageChimiqueService } from '../../../../Services/dosage-chimique.service';
import { ProduitChimiqueService } from '../../../../Services/produit-chimique.service';
import { DosageChimiqueInterface } from '../../../../Interfaces/dosage-chimique.interface';

@Component({
  selector: 'app-dosage-chimique-form',
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
  templateUrl: './dosage-chimique-form.component.html',
  styleUrl: './dosage-chimique-form.component.scss',
})
export class DosageChimiqueFormComponent implements OnInit {
  dosageChimiqueForm: FormGroup;
  idDosageChimique: string | null = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;
  produitsChimiques$!: Observable<ProduitChimiqueInterface[]>;

  constructor(
    private formBuilder: FormBuilder,
    private dosageChimiqueService: DosageChimiqueService,
    private produitChimiqueService: ProduitChimiqueService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.dosageChimiqueForm = this.formBuilder.group({
      nomDosageChimique: ['', [Validators.required, Validators.minLength(3)]],
      configurationPompe: ['', Validators.required],
      concentrationDosageChimique: [
        null,
        [Validators.required, Validators.min(0)],
      ],
      labelProduitChimique: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idDosageChimique = params.get('id');
      this.isEditMode = !!this.idDosageChimique;
      if (this.idDosageChimique && this.isEditMode) {
        this.fetchDosageChimiqueById(this.idDosageChimique);
      }
    });

    this.produitsChimiques$ =
      this.produitChimiqueService.getProduitsChimiques();
  }

  fetchDosageChimiqueById(id: string): void {
    this.dosageChimiqueService.getDosageChimiqueById(id).subscribe({
      next: (dosageChimique: DosageChimiqueInterface) => {
        this.dosageChimiqueForm.patchValue(dosageChimique);
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
    if (this.dosageChimiqueForm.valid) {
      this.isLoading = true;

      let trimmedValue: string = '';

      trimmedValue = this.dosageChimiqueForm
        .get('nomDosageChimique')
        ?.value.trim();
      this.dosageChimiqueForm.get('nomDosageChimique')?.setValue(trimmedValue);

      const formData: DosageChimiqueInterface = this.dosageChimiqueForm.value;

      console.log(formData);

      if (this.isEditMode) {
        this.editDosageChimique(formData);
      } else {
        this.addDosageChimique(formData);
      }
    }
  }

  addDosageChimique(formData: DosageChimiqueInterface): void {
    this.dosageChimiqueService.postDosageChimique(formData).subscribe({
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

  editDosageChimique(formData: DosageChimiqueInterface): void {
    if (!this.idDosageChimique) return;

    this.dosageChimiqueService
      .putDosageChimique(this.idDosageChimique, formData)
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
    this.router.navigate(['/dosages-chimiques']);
    this.dosageChimiqueService.notifyDosagesChimiquesUpdated();
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
