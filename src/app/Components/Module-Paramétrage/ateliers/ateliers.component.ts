import {
  AfterViewInit,
  Component,
  inject,
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

import { AtelierService } from '../../../Services/atelier.service';
import { AtelierInterface } from '../../../Interfaces/atelier.interface';
import { MaterialModules } from '../../../material.modules';
import { DeleteConfirmationDialogComponent } from '../../../Components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MessageResponseInterface } from '../../../Interfaces/message-response.interface';
import { AddEditSectionComponent } from '../../add-edit-section/add-edit-section.component';

@Component({
  selector: 'app-ateliers',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    AddEditSectionComponent,
  ],
  templateUrl: './ateliers.component.html',
  styleUrl: './ateliers.component.scss',
})
export class AteliersComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = ['nomAtelier', 'nomFiliale', 'actions'];
  dataSource: MatTableDataSource<AtelierInterface> =
    new MatTableDataSource<AtelierInterface>();
  isFormVisible: boolean = false;
  atelier: AtelierInterface | null = null;
  private ateliersUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private atelierService: AtelierService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.router.events
      .pipe(
        filter(
          (event: Event): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.isFormVisible =
          event.url.includes('/add') || event.url.includes('/edit');
      });
  }

  ngOnInit(): void {
    this.fetchAteliers();
    // console.log(this.dataSource.data);

    this.ateliersUpdatedSub = this.atelierService.ateliersUpdated$.subscribe(
      () => {
        this.fetchAteliers();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.ateliersUpdatedSub) {
      this.ateliersUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchAteliers() {
    this.atelierService
      .getAteliers()
      .subscribe((ateliers: AtelierInterface[]) => {
        this.dataSource.data = ateliers;
      });
  }

  hideForm(): void {
    this.router.navigate(['/ateliers']);
  }

  openDialog(atelier: AtelierInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { atelier },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && atelier.idAtelier) {
        this.handleDelete(atelier.idAtelier);
      }
    });
  }

  handleDelete(idAtelier: string): void {
    this.atelierService.deleteAtelier(idAtelier).subscribe({
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
    this.router.navigate(['/ateliers']);
    this.fetchAteliers();
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
        case 'nomAtelier':
          return compare(a.nomAtelier, b.nomAtelier, isAsc);
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
