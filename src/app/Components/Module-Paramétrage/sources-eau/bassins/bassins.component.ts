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

import { BassinService } from '../../../../Services/bassin.service';
import { BassinInterface } from '../../../../Interfaces/bassin.interface';
import { MaterialModules } from '../../../../material.modules';
import { DeleteConfirmationDialogComponent } from '../../../../Components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MessageResponseInterface } from '../../../../Interfaces/message-response.interface';
import { AddEditSectionComponent } from '../../../add-edit-section/add-edit-section.component';

@Component({
  selector: 'app-bassins',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    AddEditSectionComponent,
  ],
  templateUrl: './bassins.component.html',
  styleUrl: './bassins.component.scss',
})
export class BassinsComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = [
    'nomSourceEau',
    'volumeEau',
    'descriminant',
    'nomFiliale',
    'actions',
  ];
  dataSource: MatTableDataSource<BassinInterface> =
    new MatTableDataSource<BassinInterface>();
  bassin: BassinInterface | null = null;
  private bassinsUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private bassinService: BassinService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchBassins();
    this.bassinsUpdatedSub = this.bassinService.bassinsUpdated$.subscribe(
      () => {
        this.fetchBassins();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.bassinsUpdatedSub) {
      this.bassinsUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchBassins() {
    this.bassinService.getBassins().subscribe((bassins: BassinInterface[]) => {
      this.dataSource.data = bassins;
    });
  }

  openDialog(bassin: BassinInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { bassin },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && bassin.idSourceEau) {
        this.handleDelete(bassin.idSourceEau);
      }
    });
  }

  handleDelete(idSourceEau: string): void {
    this.bassinService.deleteBassin(idSourceEau).subscribe({
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
    this.router.navigate(['sources-eau/bassins']);
    this.fetchBassins();
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
