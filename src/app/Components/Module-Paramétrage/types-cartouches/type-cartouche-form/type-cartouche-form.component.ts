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
import { TypeCartoucheInterface } from '../../../../Interfaces/type-cartouche.interface';
import { TypeCartoucheService } from '../../../../Services/type-cartouche.service';
import { MessageResponseInterface } from '../../../../Interfaces/message-response.interface';

@Component({
  selector: 'app-type-cartouche-form',
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
  templateUrl: './type-cartouche-form.component.html',
  styleUrl: './type-cartouche-form.component.scss',
})
export class TypeCartoucheFormComponent implements OnInit {
  typeCartoucheForm: FormGroup;
  idTypeCartouche: string | null = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,

    private typeCartoucheService: TypeCartoucheService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.typeCartoucheForm = this.formBuilder.group({
      labelTypeCartouche: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idTypeCartouche = params.get('id');
      this.isEditMode = !!this.idTypeCartouche;
      if (this.idTypeCartouche && this.isEditMode) {
        this.fetchTypeCartouche(this.idTypeCartouche);
      }
    });
  }

  fetchTypeCartouche(id: string): void {
    this.typeCartoucheService.getTypeCartoucheById(id).subscribe({
      next: (typeCartouche: TypeCartoucheInterface) => {
        this.typeCartoucheForm.patchValue(typeCartouche);
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
    if (this.typeCartoucheForm.valid) {
      this.isLoading = true;

      let trimmedValue: string = '';

      trimmedValue = this.typeCartoucheForm
        .get('labelTypeCartouche')
        ?.value.trim();
      this.typeCartoucheForm.get('labelTypeCartouche')?.setValue(trimmedValue);

      const formData: TypeCartoucheInterface = this.typeCartoucheForm.value;

      console.log(formData);

      if (this.isEditMode) {
        this.editTypeCartouche(formData);
      } else {
        this.addTypeCartouche(formData);
      }
    }
  }

  addTypeCartouche(formData: TypeCartoucheInterface): void {
    this.typeCartoucheService.postTypeCartouche(formData).subscribe({
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

  editTypeCartouche(formData: TypeCartoucheInterface): void {
    if (!this.idTypeCartouche) return;

    this.typeCartoucheService
      .putTypeCartouche(this.idTypeCartouche, formData)
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
    this.router.navigate(['/types-cartouches']);
    this.typeCartoucheService.notifyTypesCartouchesUpdated();
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
