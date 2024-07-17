import { Component, OnInit } from '@angular/core';
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
import { FilialeService } from '../../../../Services/filiale.service';
import { AtelierService } from '../../../../Services/atelier.service';
import { FilialeInterface } from '../../../../Interfaces/filiale.interface';
import { AtelierInterface } from '../../../../Interfaces/atelier.interface';
import { MessageResponseInterface } from '../../../../Interfaces/message-response.interface';

@Component({
  selector: 'app-atelier-form',
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
  templateUrl: './atelier-form.component.html',
  styleUrl: './atelier-form.component.scss',
})
export class AtelierFormComponent implements OnInit {
  atelierForm: FormGroup;
  idAtelier: string | null = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;
  filiales$!: Observable<FilialeInterface[]>;

  constructor(
    private formBuilder: FormBuilder,
    private filialeService: FilialeService,
    private atelierService: AtelierService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.atelierForm = this.formBuilder.group({
      nomAtelier: ['', [Validators.required, Validators.minLength(3)]],
      nomFiliale: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Edit mode
    this.route.paramMap.subscribe((params) => {
      this.idAtelier = params.get('id');
      this.isEditMode = !!this.idAtelier;
      if (this.idAtelier && this.isEditMode) {
        this.fetchAtelier(this.idAtelier);
      }
    });

    this.filiales$ = this.filialeService.getFiliales();
  }

  fetchAtelier(id: string): void {
    this.atelierService.getAtelierById(id).subscribe({
      next: (atelier: AtelierInterface) => {
        this.atelierForm.patchValue(atelier);
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
    if (this.atelierForm.valid) {
      this.isLoading = true;

      // Remove spaces from inputs
      let trimmedValue: string = '';
      trimmedValue = this.atelierForm.get('nomAtelier')?.value.trim();
      this.atelierForm.get('nomAtelier')?.setValue(trimmedValue);

      const formData: AtelierInterface = this.atelierForm.value;

      if (this.isEditMode) {
        this.editAtelier(formData);
      } else {
        this.addAtelier(formData);
      }
    }
  }

  addAtelier(formData: AtelierInterface): void {
    this.atelierService.postAtelier(formData).subscribe({
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

  editAtelier(formData: AtelierInterface): void {
    if (!this.idAtelier) return;

    this.atelierService.putAtelier(this.idAtelier, formData).subscribe({
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
    this.router.navigate(['/ateliers']);
    this.atelierService.notifyAteliersUpdated(); //refresh the filiales list
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
