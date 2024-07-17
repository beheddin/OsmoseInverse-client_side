import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgIf, DatePipe } from '@angular/common';
import { Router, RouterModule, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Sort, MatSortModule, MatSort } from '@angular/material/sort';

import { MaterialModules } from '../../../material.modules';
import { AddEditSectionComponent } from '../../add-edit-section/add-edit-section.component';
import { CartoucheInterface } from '../../../Interfaces/cartouche.interface';
import { CartoucheService } from '../../../Services/cartouche.service';
import { MessageResponseInterface } from '../../../Interfaces/message-response.interface';
import { DeleteConfirmationDialogComponent } from '../../delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-cartouches',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    DatePipe,
    AddEditSectionComponent,
  ],
  templateUrl: './cartouches.component.html',
  styleUrl: './cartouches.component.scss',
})
export class CartouchesComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = [
    'labelProduitConsommable',
    'quantiteProduitConsommable',
    'dateUtilisationProduitConsommable',
    'nomStation',
    'labelUnite',
    'labelTypeCartouche',
    'actions',
  ];
  dataSource: MatTableDataSource<CartoucheInterface> =
    new MatTableDataSource<CartoucheInterface>();
  cartouche: CartoucheInterface | null = null;
  private cartouchesUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private cartoucheService: CartoucheService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchCartouches();
    this.cartouchesUpdatedSub =
      this.cartoucheService.cartouchesUpdated$.subscribe(() => {
        this.fetchCartouches();
      });
  }

  ngOnDestroy(): void {
    if (this.cartouchesUpdatedSub) {
      this.cartouchesUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchCartouches() {
    this.cartoucheService
      .getCartouches()
      .subscribe((cartouches: CartoucheInterface[]) => {
        this.dataSource.data = cartouches;
      });
  }

  openDialog(cartouche: CartoucheInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { cartouche },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && cartouche.idProduitConsommable) {
        this.handleDelete(cartouche.idProduitConsommable);
      }
    });
  }

  handleDelete(idProduitConsommable: string): void {
    this.cartoucheService.deleteCartouche(idProduitConsommable).subscribe({
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
    this.router.navigate(['/cartouches']);
    this.fetchCartouches();
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
        case 'labelTypeCartouche':
          return compare(a.labelTypeCartouche, b.labelTypeCartouche, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
