import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
import { MessageResponseInterface } from '../../../../Interfaces/message-response.interface';
import { StationInterface } from '../../../../Interfaces/station.interface';
import { ChecklistService } from '../../../../Services/checklist.service';
import { StationService } from '../../../../Services/station.service';
import { ChecklistInterface } from '../../../../Interfaces/checklist.interface';

@Component({
  selector: 'app-checklist-form',
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
  templateUrl: './checklist-form.component.html',
  styleUrl: './checklist-form.component.scss',
})
export class ChecklistFormComponent implements OnInit {
  checklistForm: FormGroup;
  idChecklist: string | null = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;
  stations$!: Observable<StationInterface[]>;

  constructor(
    private formBuilder: FormBuilder,
    private checklistService: ChecklistService,
    private stationService: StationService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.checklistForm = this.formBuilder.group({
      labelChecklist: ['', [Validators.required, Validators.minLength(3)]],
      nomStation: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idChecklist = params.get('id');
      this.isEditMode = !!this.idChecklist;
      if (this.idChecklist && this.isEditMode) {
        this.fetchChecklistById(this.idChecklist);
      }
    });

    this.stations$ = this.stationService.getStations();
  }

  fetchChecklistById(id: string): void {
    this.checklistService.getChecklistById(id).subscribe({
      next: (checklist: ChecklistInterface) => {
        this.checklistForm.patchValue(checklist);
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
    if (this.checklistForm.valid) {
      this.isLoading = true;

      let trimmedValue: string = '';

      trimmedValue = this.checklistForm.get('labelChecklist')?.value.trim();
      this.checklistForm.get('labelChecklist')?.setValue(trimmedValue);

      const formData: ChecklistInterface = this.checklistForm.value;

      console.log(formData);

      if (this.isEditMode) {
        this.editChecklist(formData);
      } else {
        this.addChecklist(formData);
      }
    }
  }

  addChecklist(formData: ChecklistInterface): void {
    this.checklistService.postChecklist(formData).subscribe({
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

  editChecklist(formData: ChecklistInterface): void {
    if (!this.idChecklist) return;

    this.checklistService.putChecklist(this.idChecklist, formData).subscribe({
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
    this.router.navigate(['/checklists']);
    this.checklistService.notifyChecklistsUpdated();
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
