import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MaterialModules } from '../../../../material.modules';
import { FilialeService } from '../../../../Services/filiale.service';
// import { FilialeFormModel } from '../../../../Models/filiale-form.model';
import { MessageResponseInterface } from '../../../../Interfaces/message-response.interface';
import { FilialeInterface } from '../../../../Interfaces/filiale.interface';

@Component({
  selector: 'app-edit-filiale',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModules, RouterModule, NgIf],
  templateUrl: './filiale-form.component.html',
  styleUrl: './filiale-form.component.scss',
})
export class FilialeFormComponent implements OnInit {
  filialeForm: FormGroup;
  idFiliale: string | null = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private filialeService: FilialeService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.filialeForm = this.formBuilder.group({
      nomFiliale: ['', [Validators.required, Validators.minLength(3)]],
      abbreviationNomFiliale: [
        '',
        [Validators.required, Validators.minLength(2)],
      ],
    });
  }

  ngOnInit(): void {
    //edit mode
    this.route.paramMap.subscribe((params) => {
      this.idFiliale = params.get('id');
      this.isEditMode = !!this.idFiliale; //check if idFiliale is not empty. returns true/false
      if (this.idFiliale && this.isEditMode) {
        this.fetchFiliale(this.idFiliale);
      }
    });
  }

  //edit mode
  fetchFiliale(id: string): void {
    this.filialeService.getFilialeById(id).subscribe({
      next: (filiale: FilialeInterface) => {
        this.filialeForm.patchValue(filiale);
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
    if (this.filialeForm.valid) {
      this.isLoading = true;

      //remove spaces from inputs
      let trimmedValue: string = '';
      trimmedValue = this.filialeForm.get('nomFiliale')?.value.trim();
      this.filialeForm.get('nomFiliale')?.setValue(trimmedValue);

      trimmedValue = this.filialeForm
        .get('abbreviationNomFiliale')
        ?.value.trim();
      this.filialeForm.get('abbreviationNomFiliale')?.setValue(trimmedValue);

      const formData: FilialeInterface = this.filialeForm.value;
      console.log(formData);

      if (this.isEditMode) {
        this.editFiliale(formData);
      } else {
        this.addFiliale(formData);
      }
    }
  }

  addFiliale(formData: FilialeInterface): void {
    this.filialeService.postFiliale(formData).subscribe({
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

  editFiliale(formData: FilialeInterface): void {
    if (!this.idFiliale) return;

    this.filialeService.putFiliale(this.idFiliale, formData).subscribe({
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
    //this.filialeService.getFiliales(); //refresh the filiales list
    this.router.navigate(['/filiales']);
    this.filialeService.notifyFilialesUpdated(); //refresh the filiales list
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
