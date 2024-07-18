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
import { AddEditSectionComponent } from '../../add-edit-section/add-edit-section.component';
import { ParametreSuiviInterface } from '../../../Interfaces/parametre-suivi.interface';
import { ParametreSuiviService } from '../../../Services/parametre-suivi.service';

@Component({
  selector: 'app-parametres-suivis',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    DatePipe,
    AddEditSectionComponent,
  ],
  templateUrl: './parametres-suivis.component.html',
  styleUrl: './parametres-suivis.component.scss',
})
export class ParametresSuivisComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  displayedColumns: string[] = [
    'labelParametreSuivi',
    'labelTypeSuivi',
    'actions',
  ];
  dataSource: MatTableDataSource<ParametreSuiviInterface> =
    new MatTableDataSource<ParametreSuiviInterface>();
  parametreSuivi: ParametreSuiviInterface | null = null;
  private parametresSuivisUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private parametreSuiviService: ParametreSuiviService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchParametresSuivis();
    this.parametresSuivisUpdatedSub =
      this.parametreSuiviService.parametresSuivisUpdated$.subscribe(() => {
        this.fetchParametresSuivis();
      });
  }

  ngOnDestroy(): void {
    if (this.parametresSuivisUpdatedSub) {
      this.parametresSuivisUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchParametresSuivis() {
    this.parametreSuiviService
      .getParametresSuivis()
      .subscribe((parametreSuivis: ParametreSuiviInterface[]) => {
        this.dataSource.data = parametreSuivis;
      });
  }

  openDialog(parametreSuivi: ParametreSuiviInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { parametreSuivi },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && parametreSuivi.idParametreSuivi) {
        this.handleDelete(parametreSuivi.idParametreSuivi);
      }
    });
  }

  handleDelete(idParametreSuivi: string): void {
    this.parametreSuiviService
      .deleteParametreSuivi(idParametreSuivi)
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
    this.router.navigate(['/parametres-suivis']);
    this.fetchParametresSuivis();
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
        case 'labelParametreSuivi':
          return compare(a.labelParametreSuivi, b.labelParametreSuivi, isAsc);
        case 'labelTypeSuivi':
          return compare(
            new Date(a.labelTypeSuivi).getTime(),
            new Date(b.labelTypeSuivi).getTime(),
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
