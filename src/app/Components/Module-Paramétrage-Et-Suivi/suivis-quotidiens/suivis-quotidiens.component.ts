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
import { MessageResponseInterface } from '../../../Interfaces/message-response.interface';
import { DeleteConfirmationDialogComponent } from '../../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { SuiviQuotidienInterface } from '../../../Interfaces/suivi-quotidien.interface';
import { SuiviQuotidienService } from '../../../Services/suivi-quotidien.service';
import { AddEditSectionComponent } from '../../add-edit-section/add-edit-section.component';

@Component({
  selector: 'app-suivis-quotidiens',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    DatePipe,
    AddEditSectionComponent,
  ],
  templateUrl: './suivis-quotidiens.component.html',
  styleUrl: './suivis-quotidiens.component.scss',
})
export class SuivisQuotidiensComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  displayedColumns: string[] = [
    'labelSuiviQuotidien',
    'dateSuiviQuotidien',
    'valeurSuiviQuotidien',
    'labelParametreStation',
    'actions',
  ];
  dataSource: MatTableDataSource<SuiviQuotidienInterface> =
    new MatTableDataSource<SuiviQuotidienInterface>();
  suiviQuotidien: SuiviQuotidienInterface | null = null;
  private suivisQuotidiensUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private suiviQuotidienService: SuiviQuotidienService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchSuivisQuotidiens();
    this.suivisQuotidiensUpdatedSub =
      this.suiviQuotidienService.suivisQuotidiensUpdated$.subscribe(() => {
        this.fetchSuivisQuotidiens();
      });
  }

  ngOnDestroy(): void {
    if (this.suivisQuotidiensUpdatedSub) {
      this.suivisQuotidiensUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchSuivisQuotidiens() {
    this.suiviQuotidienService
      .getSuivisQuotidiens()
      .subscribe((suiviQuotidiens: SuiviQuotidienInterface[]) => {
        this.dataSource.data = suiviQuotidiens;
      });
  }

  openDialog(suiviQuotidien: SuiviQuotidienInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { suiviQuotidien },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && suiviQuotidien.idSuiviQuotidien) {
        this.handleDelete(suiviQuotidien.idSuiviQuotidien);
      }
    });
  }

  handleDelete(idSuiviQuotidien: string): void {
    this.suiviQuotidienService
      .deleteSuiviQuotidien(idSuiviQuotidien)
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
    this.router.navigate(['/suivis-quotidiens']);
    this.fetchSuivisQuotidiens();
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
        case 'labelSuiviQuotidien':
          return compare(a.labelSuiviQuotidien, b.labelSuiviQuotidien, isAsc);
        case 'dateSuiviQuotidien':
          return compare(
            new Date(a.dateSuiviQuotidien).getTime(),
            new Date(b.dateSuiviQuotidien).getTime(),
            isAsc
          );
        case 'valeurSuiviQuotidien':
          return compare(a.valeurSuiviQuotidien, b.valeurSuiviQuotidien, isAsc);
        case 'labelParametreStation':
          return compare(
            a.labelParametreStation,
            b.labelParametreStation,
            isAsc
          );
        default:
          return 0;
      }
    });
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
