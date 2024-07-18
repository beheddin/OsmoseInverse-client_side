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
import { UniteInterface } from '../../../../Interfaces/unite.interface';
import { StationInterface } from '../../../../Interfaces/station.interface';
import { ProduitChimiqueInterface } from '../../../../Interfaces/produit-chimique.interface';
import { ProduitChimiqueService } from '../../../../Services/produit-chimique.service';
import { StationService } from '../../../../Services/station.service';
import { UniteService } from '../../../../Services/unite.service';
import { CategorieProduitChimiqueService } from '../../../../Services/categorie-produit-chimique.service';
import { CategorieProduitChimiqueInterface } from '../../../../Interfaces/categorie-produit-chimique.interface';

@Component({
  selector: 'app-produit-chimique-form',
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
  templateUrl: './produit-chimique-form.component.html',
  styleUrl: './produit-chimique-form.component.scss',
})
export class ProduitChimiqueFormComponent implements OnInit {
  produitChimiqueForm: FormGroup;
  idProduitChimique: string | null = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;
  stations$!: Observable<StationInterface[]>;
  unites$!: Observable<UniteInterface[]>;
  categoriesProduitsChimiques$!: Observable<
    CategorieProduitChimiqueInterface[]
  >;

  constructor(
    private formBuilder: FormBuilder,

    private produitChimiqueService: ProduitChimiqueService,
    private stationService: StationService,
    private uniteService: UniteService,
    private categorieProduitChimiqueService: CategorieProduitChimiqueService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.produitChimiqueForm = this.formBuilder.group({
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
      nomCategorieProduitChimique: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idProduitChimique = params.get('id');
      this.isEditMode = !!this.idProduitChimique;
      if (this.idProduitChimique && this.isEditMode) {
        this.fetchProduitChimiqueById(this.idProduitChimique);
      }
    });

    this.stations$ = this.stationService.getStations();
    this.unites$ = this.uniteService.getUnites();
    this.categoriesProduitsChimiques$ =
      this.categorieProduitChimiqueService.getCategoriesProduitsChimiques();
  }

  fetchProduitChimiqueById(id: string): void {
    this.produitChimiqueService.getProduitChimiqueById(id).subscribe({
      next: (produitChimique: ProduitChimiqueInterface) => {
        this.produitChimiqueForm.patchValue(produitChimique);
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
    if (this.produitChimiqueForm.valid) {
      this.isLoading = true;

      let trimmedValue: string = '';

      trimmedValue = this.produitChimiqueForm
        .get('labelProduitConsommable')
        ?.value.trim();
      this.produitChimiqueForm
        .get('labelProduitConsommable')
        ?.setValue(trimmedValue);

      const formData: ProduitChimiqueInterface = this.produitChimiqueForm.value;

      console.log(formData);

      if (this.isEditMode) {
        this.editProduitChimique(formData);
      } else {
        this.addProduitChimique(formData);
      }
    }
  }

  addProduitChimique(formData: ProduitChimiqueInterface): void {
    this.produitChimiqueService.postProduitChimique(formData).subscribe({
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

  editProduitChimique(formData: ProduitChimiqueInterface): void {
    if (!this.idProduitChimique) return;

    this.produitChimiqueService
      .putProduitChimique(this.idProduitChimique, formData)
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
    this.router.navigate(['/produits-chimiques']);
    this.produitChimiqueService.notifyProduitsChimiquesUpdated();
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
