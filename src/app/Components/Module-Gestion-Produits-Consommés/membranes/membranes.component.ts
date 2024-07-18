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
import { MembraneInterface } from '../../../Interfaces/membrane.interface';
import { MembraneService } from '../../../Services/membrane.service';
import { MessageResponseInterface } from '../../../Interfaces/message-response.interface';
import { DeleteConfirmationDialogComponent } from '../../delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-membranes',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    DatePipe,
    AddEditSectionComponent,
  ],
  templateUrl: './membranes.component.html',
  styleUrl: './membranes.component.scss',
})
export class MembranesComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = [
    'labelProduitConsommable',
    'quantiteProduitConsommable',
    'dateUtilisationProduitConsommable',
    'nomStation',
    'labelUnite',
    'labelTypeMembrane',
    'actions',
  ];
  dataSource: MatTableDataSource<MembraneInterface> =
    new MatTableDataSource<MembraneInterface>();
  membrane: MembraneInterface | null = null;
  private membranesUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private membraneService: MembraneService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchMembranes();
    this.membranesUpdatedSub = this.membraneService.membranesUpdated$.subscribe(
      () => {
        this.fetchMembranes();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.membranesUpdatedSub) {
      this.membranesUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchMembranes() {
    this.membraneService
      .getMembranes()
      .subscribe((membranes: MembraneInterface[]) => {
        this.dataSource.data = membranes;
      });
  }

  openDialog(membrane: MembraneInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { membrane },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && membrane.idProduitConsommable) {
        this.handleDelete(membrane.idProduitConsommable);
      }
    });
  }

  handleDelete(idProduitConsommable: string): void {
    this.membraneService.deleteMembrane(idProduitConsommable).subscribe({
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
    this.router.navigate(['/membranes']);
    this.fetchMembranes();
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
        case 'labelProduitConsommable':
          return compare(
            a.labelProduitConsommable,
            b.labelProduitConsommable,
            isAsc
          );
        case 'quantiteProduitConsommable':
          return compare(
            a.quantiteProduitConsommable,
            b.quantiteProduitConsommable,
            isAsc
          );
        case 'dateUtilisationProduitConsommable':
          return compare(
            new Date(a.dateUtilisationProduitConsommable).getTime(),
            new Date(b.dateUtilisationProduitConsommable).getTime(),
            isAsc
          );
        case 'nomStation':
          return compare(a.nomStation, b.nomStation, isAsc);
        case 'labelUnite':
          return compare(a.labelUnite, b.labelUnite, isAsc);
        case 'labelTypeMembrane':
          return compare(a.labelTypeMembrane, b.labelTypeMembrane, isAsc);

        default:
          return 0;
      }
    });
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
