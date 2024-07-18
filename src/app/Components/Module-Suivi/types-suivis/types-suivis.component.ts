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
import { TypeSuiviInterface } from '../../../Interfaces/type-suivi.interface';
import { TypeSuiviService } from '../../../Services/type-suivi.service';

@Component({
  selector: 'app-types-suivis',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    DatePipe,
    AddEditSectionComponent,
  ],
  templateUrl: './types-suivis.component.html',
  styleUrl: './types-suivis.component.scss',
})
export class TypesSuivisComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = ['labelTypeSuivi', 'actions'];
  dataSource: MatTableDataSource<TypeSuiviInterface> =
    new MatTableDataSource<TypeSuiviInterface>();
  typeSuivi: TypeSuiviInterface | null = null;
  private typesSuivisUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private typeSuiviService: TypeSuiviService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchTypesSuivis();
    this.typesSuivisUpdatedSub =
      this.typeSuiviService.typesSuivisUpdated$.subscribe(() => {
        this.fetchTypesSuivis();
      });
  }

  ngOnDestroy(): void {
    if (this.typesSuivisUpdatedSub) {
      this.typesSuivisUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchTypesSuivis() {
    this.typeSuiviService
      .getTypesSuivis()
      .subscribe((typeSuivis: TypeSuiviInterface[]) => {
        this.dataSource.data = typeSuivis;
      });
  }

  openDialog(typeSuivi: TypeSuiviInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { typeSuivi },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && typeSuivi.idTypeSuivi) {
        this.handleDelete(typeSuivi.idTypeSuivi);
      }
    });
  }

  handleDelete(idTypeSuivi: string): void {
    this.typeSuiviService.deleteTypeSuivi(idTypeSuivi).subscribe({
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
    this.router.navigate(['/types-suivis']);
    this.fetchTypesSuivis();
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
        case 'labelTypeSuivi':
          return compare(a.labelTypeSuivi, b.labelTypeSuivi, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
