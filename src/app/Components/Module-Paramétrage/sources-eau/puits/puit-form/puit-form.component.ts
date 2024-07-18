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

import { MaterialModules } from '../../../../../material.modules';
import { FilialeService } from '../../../../../Services/filiale.service';
import { PuitService } from '../../../../../Services/puit.service';
import { FilialeInterface } from '../../../../../Interfaces/filiale.interface';
import { PuitInterface } from '../../../../../Interfaces/puit.interface';
import { MessageResponseInterface } from '../../../../../Interfaces/message-response.interface';

@Component({
  selector: 'app-puit-form',
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
  templateUrl: './puit-form.component.html',
  styleUrl: './puit-form.component.scss',
})
export class PuitFormComponent implements OnInit {
  puitForm: FormGroup;
  idSourceEau: string | null = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;
  filiales$!: Observable<FilialeInterface[]>;

  constructor(
    private formBuilder: FormBuilder,
    private filialeService: FilialeService,
    private puitService: PuitService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.puitForm = this.formBuilder.group({
      nomSourceEau: ['', [Validators.required, Validators.minLength(3)]],
      volumeEau: [null, [Validators.required, Validators.min(0)]], //volumeEau cannot be negative
      descriminant: ['Puit', Validators.required], //set the default value
      nomFiliale: ['', Validators.required],
      profondeur: [null, [Validators.required, Validators.min(0)]], //profondeur cannot be negative
      typeAmortissement: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idSourceEau = params.get('id');
      this.isEditMode = !!this.idSourceEau;
      if (this.idSourceEau && this.isEditMode) {
        this.fetchPuit(this.idSourceEau);
      }
    });

    this.filiales$ = this.filialeService.getFiliales();
  }

  fetchPuit(id: string): void {
    this.puitService.getPuitById(id).subscribe({
      next: (puit: PuitInterface) => {
        this.puitForm.patchValue(puit);
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
    if (this.puitForm.valid) {
      this.isLoading = true;

      let trimmedValue: string = '';

      trimmedValue = this.puitForm.get('nomSourceEau')?.value.trim();
      this.puitForm.get('nomSourceEau')?.setValue(trimmedValue);

      //this.puitForm.get('descriminant')?.setValue('Puit');

      const formData: PuitInterface = this.puitForm.value;

      console.log(formData);

      if (this.isEditMode) {
        this.editPuit(formData);
      } else {
        this.addPuit(formData);
      }
    }
  }

  addPuit(formData: PuitInterface): void {
    this.puitService.postPuit(formData).subscribe({
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

  editPuit(formData: PuitInterface): void {
    if (!this.idSourceEau) return;

    this.puitService.putPuit(this.idSourceEau, formData).subscribe({
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
    this.router.navigate(['sources-eau/puits']);
    this.puitService.notifyPuitsUpdated();
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
