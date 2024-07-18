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
import { TypeMembraneInterface } from '../../../../Interfaces/type-membrane.interface';
import { TypeMembraneService } from '../../../../Services/type-membrane.service';
import { MessageResponseInterface } from '../../../../Interfaces/message-response.interface';

@Component({
  selector: 'app-type-membrane-form',
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
  templateUrl: './type-membrane-form.component.html',
  styleUrl: './type-membrane-form.component.scss',
})
export class TypeMembraneFormComponent implements OnInit {
  typeMembraneForm: FormGroup;
  idTypeMembrane: string | null = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,

    private typeMembraneService: TypeMembraneService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.typeMembraneForm = this.formBuilder.group({
      labelTypeMembrane: ['', [Validators.required, Validators.minLength(3)]],
      tailleTypeMembrane: [null, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idTypeMembrane = params.get('id');
      this.isEditMode = !!this.idTypeMembrane;
      if (this.idTypeMembrane && this.isEditMode) {
        this.fetchTypeMembrane(this.idTypeMembrane);
      }
    });
  }

  fetchTypeMembrane(id: string): void {
    this.typeMembraneService.getTypeMembraneById(id).subscribe({
      next: (typeMembrane: TypeMembraneInterface) => {
        this.typeMembraneForm.patchValue(typeMembrane);
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
    if (this.typeMembraneForm.valid) {
      this.isLoading = true;

      let trimmedValue: string = '';

      trimmedValue = this.typeMembraneForm
        .get('labelTypeMembrane')
        ?.value.trim();
      this.typeMembraneForm.get('labelTypeMembrane')?.setValue(trimmedValue);

      const formData: TypeMembraneInterface = this.typeMembraneForm.value;

      console.log(formData);

      if (this.isEditMode) {
        this.editTypeMembrane(formData);
      } else {
        this.addTypeMembrane(formData);
      }
    }
  }

  addTypeMembrane(formData: TypeMembraneInterface): void {
    this.typeMembraneService.postTypeMembrane(formData).subscribe({
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

  editTypeMembrane(formData: TypeMembraneInterface): void {
    if (!this.idTypeMembrane) return;

    this.typeMembraneService
      .putTypeMembrane(this.idTypeMembrane, formData)
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
    this.router.navigate(['/types-membranes']);
    this.typeMembraneService.notifyTypesMembranesUpdated();
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
