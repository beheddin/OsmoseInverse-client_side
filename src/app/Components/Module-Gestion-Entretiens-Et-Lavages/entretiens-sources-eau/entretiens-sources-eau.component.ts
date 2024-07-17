import {
  AfterViewInit,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgIf } from '@angular/common';
import { Router, RouterModule, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Sort, MatSortModule, MatSort } from '@angular/material/sort';

import { EntretienSourceEauService } from '../../../Services/entretien-source-eau.service';
import { EntretienSourceEauInterface } from '../../../Interfaces/entretien-source-eau.interface';
import { MaterialModules } from '../../../material.modules';
import { DeleteConfirmationDialogComponent } from '../../../Components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MessageResponseInterface } from '../../../Interfaces/message-response.interface';
import { AddEditSectionComponent } from '../../add-edit-section/add-edit-section.component';

@Component({
  selector: 'app-entretiens-sources-eau',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    AddEditSectionComponent,
  ],
  templateUrl: './entretiens-sources-eau.component.html',
  styleUrl: './entretiens-sources-eau.component.scss',
})
export class SourcesEauEntretiensComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  displayedColumns: string[] = [
    'nomEntretienSourceEau',
    'descriptionEntretienSourceEau',
    'chargeEntretienSourceEau',
    'isExternalEntretienSourceEau',
    'descriminant',
    'nomSourceEau',
    'nomFournisseur',
    'actions',
  ];
  dataSource: MatTableDataSource<EntretienSourceEauInterface> =
    new MatTableDataSource<EntretienSourceEauInterface>();
  entretienSourceEau: EntretienSourceEauInterface | null = null;
  private entretiensSourcesEauUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private entretienSourceEauService: EntretienSourceEauService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchEntretiensSourcesEau();
    this.entretiensSourcesEauUpdatedSub =
      this.entretienSourceEauService.entretiensSourcesEauUpdated$.subscribe(
        () => {
          this.fetchEntretiensSourcesEau();
        }
      );
  }

  ngOnDestroy(): void {
    if (this.entretiensSourcesEauUpdatedSub) {
      this.entretiensSourcesEauUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchEntretiensSourcesEau() {
    this.entretienSourceEauService
      .getEntretiensSourcesEau()
      .subscribe((entretiensSourcesEau: EntretienSourceEauInterface[]) => {
        this.dataSource.data = entretiensSourcesEau;
      });
  }

  toggleIsExternalEntretienSourceEau(id: string): void {
    this.entretienSourceEauService
      .toggleIsExternalEntretienSourceEau(id)
      .subscribe({
        next: (response: MessageResponseInterface) => {
          if (this.entretienSourceEau) {
            this.entretienSourceEau.isExternalEntretienSourceEau =
              !this.entretienSourceEau.isExternalEntretienSourceEau; // update local state
          }
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

  openDialog(entretienSourceEau: EntretienSourceEauInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { entretienSourceEau },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && entretienSourceEau.idEntretienSourceEau) {
        this.handleDelete(entretienSourceEau.idEntretienSourceEau);
      }
    });
  }

  handleDelete(idEntretienSourceEau: string): void {
    this.entretienSourceEauService
      .deleteEntretienSourceEau(idEntretienSourceEau)
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
    this.router.navigate(['/entretiens-sources-eau']);
    this.fetchEntretiensSourcesEau();
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
        case 'nomEntretienSourceEau':
          return compare(
            a.nomEntretienSourceEau,
            b.nomEntretienSourceEau,
            isAsc
          );
        case 'chargeEntretienSourceEau':
          return compare(
            a.chargeEntretienSourceEau,
            b.chargeEntretienSourceEau,
            isAsc
          );
        case 'isExternalEntretienSourceEau':
          return compareBoolean(
            a.isExternalEntretienSourceEau,
            b.isExternalEntretienSourceEau,
            isAsc
          );
        case 'descriminant':
          return compare(a.descriminant || '', b.descriminant || '', isAsc);
        case 'nomSourceEau':
          return compare(a.nomSourceEau, b.nomSourceEau, isAsc);
        case 'nomFournisseur':
          return compare(a.nomFournisseur, b.nomFournisseur, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function compareBoolean(
  a: boolean | undefined,
  b: boolean | undefined,
  isAsc: boolean
) {
  const valA = a !== undefined ? a : false;
  const valB = b !== undefined ? b : false;
  return (valA === valB ? 0 : valA ? 1 : -1) * (isAsc ? 1 : -1);
}
