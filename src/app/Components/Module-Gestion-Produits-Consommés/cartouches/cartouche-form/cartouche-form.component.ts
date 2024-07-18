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
import { CartoucheInterface } from '../../../../Interfaces/cartouche.interface';
import { TypeCartoucheInterface } from '../../../../Interfaces/type-cartouche.interface';
import { CartoucheService } from '../../../../Services/cartouche.service';
import { StationService } from '../../../../Services/station.service';
import { UniteService } from '../../../../Services/unite.service';
import { TypeCartoucheService } from '../../../../Services/type-cartouche.service';

@Component({
  selector: 'app-cartouche-form',
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
  templateUrl: './cartouche-form.component.html',
  styleUrl: './cartouche-form.component.scss',
})
export class CartoucheFormComponent implements OnInit {
  cartoucheForm: FormGroup;
  idCartouche: string | null = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;
  stations$!: Observable<StationInterface[]>;
  unites$!: Observable<UniteInterface[]>;
  typesCartouches$!: Observable<TypeCartoucheInterface[]>;

  constructor(
    private formBuilder: FormBuilder,

    private cartoucheService: CartoucheService,
    private stationService: StationService,
    private uniteService: UniteService,
    private typeCartoucheService: TypeCartoucheService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.cartoucheForm = this.formBuilder.group({
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
      labelTypeCartouche: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idCartouche = params.get('id');
      this.isEditMode = !!this.idCartouche;
      if (this.idCartouche && this.isEditMode) {
        this.fetchCartouche(this.idCartouche);
      }
    });

    this.stations$ = this.stationService.getStations();
    this.unites$ = this.uniteService.getUnites();
    this.typesCartouches$ = this.typeCartoucheService.getTypesCartouches();
  }

  fetchCartouche(id: string): void {
    this.cartoucheService.getCartoucheById(id).subscribe({
      next: (cartouche: CartoucheInterface) => {
        this.cartoucheForm.patchValue(cartouche);
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
    if (this.cartoucheForm.valid) {
      this.isLoading = true;

      let trimmedValue: string = '';

      trimmedValue = this.cartoucheForm
        .get('labelProduitConsommable')
        ?.value.trim();
      this.cartoucheForm.get('labelProduitConsommable')?.setValue(trimmedValue);

      const formData: CartoucheInterface = this.cartoucheForm.value;

      console.log(formData);

      if (this.isEditMode) {
        this.editCartouche(formData);
      } else {
        this.addCartouche(formData);
      }
    }
  }

  addCartouche(formData: CartoucheInterface): void {
    this.cartoucheService.postCartouche(formData).subscribe({
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

  editCartouche(formData: CartoucheInterface): void {
    if (!this.idCartouche) return;

    this.cartoucheService.putCartouche(this.idCartouche, formData).subscribe({
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
    this.router.navigate(['/cartouches']);
    this.cartoucheService.notifyCartouchesUpdated();
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
