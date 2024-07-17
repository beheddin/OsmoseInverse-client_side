import {
  AfterViewInit,
  Component,
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

import { MaterialModules } from '../../../material.modules';
import { AddEditSectionComponent } from '../../add-edit-section/add-edit-section.component';
import { UniteInterface } from '../../../Interfaces/unite.interface';
import { UniteService } from '../../../Services/unite.service';
import { DeleteConfirmationDialogComponent } from '../../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MessageResponseInterface } from '../../../Interfaces/message-response.interface';

@Component({
  selector: 'app-unites',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    AddEditSectionComponent,
  ],
  templateUrl: './unites.component.html',
  styleUrl: './unites.component.scss',
})
export class UnitesComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = ['labelUnite', 'actions'];
  dataSource: MatTableDataSource<UniteInterface> =
    new MatTableDataSource<UniteInterface>();
  unite: UniteInterface | null = null;
  private unitesUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private uniteService: UniteService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchUnites();
    this.unitesUpdatedSub = this.uniteService.unitesUpdated$.subscribe(() => {
      this.fetchUnites();
    });
  }

  ngOnDestroy(): void {
    if (this.unitesUpdatedSub) {
      this.unitesUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchUnites() {
    this.uniteService.getUnites().subscribe((unites: UniteInterface[]) => {
      this.dataSource.data = unites;
    });
  }

  openDialog(unite: UniteInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { unite },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && unite.idUnite) {
        this.handleDelete(unite.idUnite);
      }
    });
  }

  handleDelete(idUnite: string): void {
    this.uniteService.deleteUnite(idUnite).subscribe({
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
    this.router.navigate(['/unites']);
    this.fetchUnites();
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
        case 'labelUnite':
          return compare(a.labelUnite, b.labelUnite, isAsc);

        default:
          return 0;
      }
    });
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
