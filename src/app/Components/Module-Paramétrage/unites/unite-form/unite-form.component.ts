import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MaterialModules } from '../../../../material.modules';
import { UniteInterface } from '../../../../Interfaces/unite.interface';
import { MessageResponseInterface } from '../../../../Interfaces/message-response.interface';
import { UniteService } from '../../../../Services/unite.service';

@Component({
  selector: 'app-unite-form',
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
  templateUrl: './unite-form.component.html',
  styleUrl: './unite-form.component.scss',
})
export class UniteFormComponent implements OnInit {
  uniteForm: FormGroup;
  idUnite: string | null = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private uniteService: UniteService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.uniteForm = this.formBuilder.group({
      labelUnite: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idUnite = params.get('id');
      this.isEditMode = !!this.idUnite;
      if (this.idUnite && this.isEditMode) {
        this.fetchUnite(this.idUnite);
      }
    });
  }

  fetchUnite(id: string): void {
    this.uniteService.getUniteById(id).subscribe({
      next: (unite: UniteInterface) => {
        this.uniteForm.patchValue(unite);
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
    if (this.uniteForm.valid) {
      this.isLoading = true;

      let trimmedValue: string = '';

      trimmedValue = this.uniteForm.get('labelUnite')?.value.trim();
      this.uniteForm.get('labelUnite')?.setValue(trimmedValue);

      const formData: UniteInterface = this.uniteForm.value;

      console.log(formData);

      if (this.isEditMode) {
        this.editUnite(formData);
      } else {
        this.addUnite(formData);
      }
    }
  }

  addUnite(formData: UniteInterface): void {
    this.uniteService.postUnite(formData).subscribe({
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

  editUnite(formData: UniteInterface): void {
    if (!this.idUnite) return;

    this.uniteService.putUnite(this.idUnite, formData).subscribe({
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
    this.router.navigate(['/unites']);
    this.uniteService.notifyUnitesUpdated();
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
