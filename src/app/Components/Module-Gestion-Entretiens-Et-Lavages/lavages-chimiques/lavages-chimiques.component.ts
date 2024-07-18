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
import { LavageChimiqueInterface } from '../../../Interfaces/lavage-chimique.interface';
import { LavageChimiqueService } from '../../../Services/lavage-chimique.service';
import { DeleteConfirmationDialogComponent } from '../../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MessageResponseInterface } from '../../../Interfaces/message-response.interface';

@Component({
  selector: 'app-lavages-chimiques',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    DatePipe,
    AddEditSectionComponent,
  ],
  templateUrl: './lavages-chimiques.component.html',
  styleUrl: './lavages-chimiques.component.scss',
})
export class LavagesChimiquesComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  displayedColumns: string[] = [
    'nomLavageChimique',
    'dateLavageChimique',
    'labelProduitChimique',
    'nomStation',
    'actions',
  ];
  dataSource: MatTableDataSource<LavageChimiqueInterface> =
    new MatTableDataSource<LavageChimiqueInterface>();
  lavageChimique: LavageChimiqueInterface | null = null;
  private lavagesChimiquesUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private lavageChimiqueService: LavageChimiqueService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchLavagesChimiques();
    this.lavagesChimiquesUpdatedSub =
      this.lavageChimiqueService.lavagesChimiquesUpdated$.subscribe(() => {
        this.fetchLavagesChimiques();
      });
  }

  ngOnDestroy(): void {
    if (this.lavagesChimiquesUpdatedSub) {
      this.lavagesChimiquesUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchLavagesChimiques() {
    this.lavageChimiqueService
      .getLavagesChimiques()
      .subscribe((lavageChimiques: LavageChimiqueInterface[]) => {
        this.dataSource.data = lavageChimiques;
      });
  }

  openDialog(lavageChimique: LavageChimiqueInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { lavageChimique },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && lavageChimique.idLavageChimique) {
        this.handleDelete(lavageChimique.idLavageChimique);
      }
    });
  }

  handleDelete(idLavageChimique: string): void {
    this.lavageChimiqueService
      .deleteLavageChimique(idLavageChimique)
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
    this.router.navigate(['/lavages-chimiques']);
    this.fetchLavagesChimiques();
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
        case 'nomLavageChimique':
          return compare(a.nomLavageChimique, b.nomLavageChimique, isAsc);
        case 'dateLavageChimique':
          return compare(
            new Date(a.dateLavageChimique).getTime(),
            new Date(b.dateLavageChimique).getTime(),
            isAsc
          );
        case 'labelProduitChimique':
          return compare(a.labelProduitChimique, b.labelProduitChimique, isAsc);
        case 'nomStation':
          return compare(a.nomStation, b.nomStation, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
