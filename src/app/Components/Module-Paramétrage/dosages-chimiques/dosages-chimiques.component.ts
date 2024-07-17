import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe, NgIf } from '@angular/common';
import { Router, RouterModule, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Sort, MatSortModule, MatSort } from '@angular/material/sort';

import { MaterialModules } from '../../../material.modules';
import { AddEditSectionComponent } from '../../add-edit-section/add-edit-section.component';
import { DosageChimiqueInterface } from '../../../Interfaces/dosage-chimique.interface';
import { DosageChimiqueService } from '../../../Services/dosage-chimique.service';
import { DeleteConfirmationDialogComponent } from '../../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MessageResponseInterface } from '../../../Interfaces/message-response.interface';

@Component({
  selector: 'app-dosages-chimiques',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    DatePipe,
    AddEditSectionComponent,
  ],
  templateUrl: './dosages-chimiques.component.html',
  styleUrl: './dosages-chimiques.component.scss',
})
export class DosagesChimiquesComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  displayedColumns: string[] = [
    'nomDosageChimique',
    'configurationPompe',
    'concentrationDosageChimique',
    'labelProduitChimique',
    'actions',
  ];
  dataSource: MatTableDataSource<DosageChimiqueInterface> =
    new MatTableDataSource<DosageChimiqueInterface>();
  dosageChimique: DosageChimiqueInterface | null = null;
  private dosageChimiquesUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private dosageChimiqueService: DosageChimiqueService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchDosagesChimiques();
    this.dosageChimiquesUpdatedSub =
      this.dosageChimiqueService.dosagesChimiquesUpdated$.subscribe(() => {
        this.fetchDosagesChimiques();
      });
  }

  ngOnDestroy(): void {
    if (this.dosageChimiquesUpdatedSub) {
      this.dosageChimiquesUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchDosagesChimiques() {
    this.dosageChimiqueService
      .getDosagesChimiques()
      .subscribe((dosageChimiques: DosageChimiqueInterface[]) => {
        this.dataSource.data = dosageChimiques;
      });
  }

  openDialog(dosageChimique: DosageChimiqueInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { dosageChimique },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && dosageChimique.idDosageChimique) {
        this.handleDelete(dosageChimique.idDosageChimique);
      }
    });
  }

  handleDelete(idDosageChimique: string): void {
    this.dosageChimiqueService
      .deleteDosageChimique(idDosageChimique)
      .subscribe({
        next: (response: MessageResponseInterface) => {
          this.handleSuccess(response.message);
        },
        error: (error: MessageResponseInterface) => {
          this.handleError(error.message);
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
    this.router.navigate(['/dosages-chimiques']);
    this.fetchDosagesChimiques();
  }

  handleError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
    });
  }

  handleComplete(): void {
    console.log('operation complete');
  }

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'nomDosageChimique':
          return compare(a.nomDosageChimique, b.nomDosageChimique, isAsc);

        case 'configurationPompe':
          return compare(a.configurationPompe, b.configurationPompe, isAsc);
        case 'concentrationDosageChimique':
          return compare(
            a.concentrationDosageChimique,
            b.concentrationDosageChimique,
            isAsc
          );
        case 'labelProduitChimique':
          return compare(a.labelProduitChimique, b.labelProduitChimique, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
