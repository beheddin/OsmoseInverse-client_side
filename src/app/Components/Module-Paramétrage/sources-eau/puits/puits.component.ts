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

import { PuitService } from '../../../../Services/puit.service';
import { PuitInterface } from '../../../../Interfaces/puit.interface';
import { MaterialModules } from '../../../../material.modules';
import { DeleteConfirmationDialogComponent } from '../../../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MessageResponseInterface } from '../../../../Interfaces/message-response.interface';
import { AddEditSectionComponent } from '../../../add-edit-section/add-edit-section.component';

@Component({
  selector: 'app-puits',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    AddEditSectionComponent,
  ],
  templateUrl: './puits.component.html',
  styleUrl: './puits.component.scss',
})
export class PuitsComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = [
    'nomSourceEau',
    'volumeEau',
    'descriminant',
    'nomFiliale',
    'profondeur',
    'typeAmortissement',
    'actions',
  ];
  dataSource: MatTableDataSource<PuitInterface> =
    new MatTableDataSource<PuitInterface>();
  puit: PuitInterface | null = null;
  private puitsUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private puitService: PuitService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchPuits();
    this.puitsUpdatedSub = this.puitService.puitsUpdated$.subscribe(() => {
      this.fetchPuits();
    });
  }

  ngOnDestroy(): void {
    if (this.puitsUpdatedSub) {
      this.puitsUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchPuits() {
    this.puitService.getPuits().subscribe((puits: PuitInterface[]) => {
      this.dataSource.data = puits;
    });
  }

  openDialog(puit: PuitInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { puit },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && puit.idSourceEau) {
        this.handleDelete(puit.idSourceEau);
      }
    });
  }

  handleDelete(idSourceEau: string): void {
    this.puitService.deletePuit(idSourceEau).subscribe({
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
    this.router.navigate(['sources-eau/puits']);
    this.fetchPuits();
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
        case 'nomSourceEau':
          return compare(a.nomSourceEau, b.nomSourceEau, isAsc);
        case 'volumeEau':
          return compare(a.volumeEau, b.volumeEau, isAsc);
        case 'descriminant':
          return compare(a.descriminant || '', b.descriminant || '', isAsc);
        case 'nomFiliale':
          return compare(a.nomFiliale, b.nomFiliale, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
