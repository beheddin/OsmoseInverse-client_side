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
import { BassinService } from '../../../../../Services/bassin.service';
import { FilialeInterface } from '../../../../../Interfaces/filiale.interface';
import { BassinInterface } from '../../../../../Interfaces/bassin.interface';
import { MessageResponseInterface } from '../../../../../Interfaces/message-response.interface';

@Component({
  selector: 'app-bassin-form',
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
  templateUrl: './bassin-form.component.html',
  styleUrl: './bassin-form.component.scss',
})
export class BassinFormComponent implements OnInit {
  bassinForm: FormGroup;
  idSourceEau: string | null = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;
  filiales$!: Observable<FilialeInterface[]>;

  constructor(
    private formBuilder: FormBuilder,
    private filialeService: FilialeService,
    private bassinService: BassinService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.bassinForm = this.formBuilder.group({
      nomSourceEau: ['', [Validators.required, Validators.minLength(3)]],
      volumeEau: [null, [Validators.required, Validators.min(0)]], //volumeEau cannot be negative
      descriminant: ['Bassin', Validators.required], //set the default value
      nomFiliale: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idSourceEau = params.get('id');
      this.isEditMode = !!this.idSourceEau;
      if (this.idSourceEau && this.isEditMode) {
        this.fetchBassin(this.idSourceEau);
      }
    });

    this.filiales$ = this.filialeService.getFiliales();
  }

  fetchBassin(id: string): void {
    this.bassinService.getBassinById(id).subscribe({
      next: (bassin: BassinInterface) => {
        this.bassinForm.patchValue(bassin);
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
    if (this.bassinForm.valid) {
      this.isLoading = true;

      let trimmedValue: string = '';

      trimmedValue = this.bassinForm.get('nomSourceEau')?.value.trim();
      this.bassinForm.get('nomSourceEau')?.setValue(trimmedValue);

      //this.bassinForm.get('descriminant')?.setValue('Bassin');

      const formData: BassinInterface = this.bassinForm.value;

      console.log(formData);

      if (this.isEditMode) {
        this.editBassin(formData);
      } else {
        this.addBassin(formData);
      }
    }
  }

  addBassin(formData: BassinInterface): void {
    this.bassinService.postBassin(formData).subscribe({
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

  editBassin(formData: BassinInterface): void {
    if (!this.idSourceEau) return;

    this.bassinService.putBassin(this.idSourceEau, formData).subscribe({
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
    this.router.navigate(['sources-eau/bassins']);
    this.bassinService.notifyBassinsUpdated();
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
