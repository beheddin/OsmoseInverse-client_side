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
import { NatureEquipementInterface } from '../../../../Interfaces/nature-equipement.interface';
import { NatureEquipementService } from '../../../../Services/nature-equipement.service';
import { MessageResponseInterface } from '../../../../Interfaces/message-response.interface';

@Component({
  selector: 'app-nature-equipement-form',
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
  templateUrl: './nature-equipement-form.component.html',
  styleUrl: './nature-equipement-form.component.scss',
})
export class NatureEquipementFormComponent implements OnInit {
  natureEquipementForm: FormGroup;
  idNatureEquipement: string | null = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;
  naturesEquipements$!: Observable<NatureEquipementInterface[]>;

  constructor(
    private formBuilder: FormBuilder,
    private NatureEquipementService: NatureEquipementService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.natureEquipementForm = this.formBuilder.group({
      labelNatureEquipement: [
        '',
        [Validators.required, Validators.minLength(3)],
      ],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idNatureEquipement = params.get('id');
      this.isEditMode = !!this.idNatureEquipement;
      if (this.idNatureEquipement && this.isEditMode) {
        this.fetchNatureEquipement(this.idNatureEquipement);
      }
    });

    this.naturesEquipements$ =
      this.NatureEquipementService.getNaturesEquipements();
  }

  fetchNatureEquipement(id: string): void {
    this.NatureEquipementService.getNatureEquipementById(id).subscribe({
      next: (NatureEquipement: NatureEquipementInterface) => {
        this.natureEquipementForm.patchValue(NatureEquipement);
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
    if (this.natureEquipementForm.valid) {
      this.isLoading = true;

      let trimmedValue: string = '';

      trimmedValue = this.natureEquipementForm
        .get('labelNatureEquipement')
        ?.value.trim();
      this.natureEquipementForm
        .get('labelNatureEquipement')
        ?.setValue(trimmedValue);

      const formData: NatureEquipementInterface =
        this.natureEquipementForm.value;

      console.log(formData);

      if (this.isEditMode) {
        this.editEquipement(formData);
      } else {
        this.addEquipement(formData);
      }
    }
  }

  addEquipement(formData: NatureEquipementInterface): void {
    this.NatureEquipementService.postNatureEquipement(formData).subscribe({
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

  editEquipement(formData: NatureEquipementInterface): void {
    if (!this.idNatureEquipement) return;

    this.NatureEquipementService.putNatureEquipement(
      this.idNatureEquipement,
      formData
    ).subscribe({
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
    this.router.navigate(['/natures-equipements']);
    this.NatureEquipementService.notifyNaturesEquipementsUpdated();
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
