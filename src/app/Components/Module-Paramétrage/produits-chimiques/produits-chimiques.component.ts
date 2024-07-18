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
import { ProduitChimiqueInterface } from '../../../Interfaces/produit-chimique.interface';
import { ProduitChimiqueService } from '../../../Services/produit-chimique.service';
import { DeleteConfirmationDialogComponent } from '../../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MessageResponseInterface } from '../../../Interfaces/message-response.interface';

@Component({
  selector: 'app-produits-chimiques',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    DatePipe,
    AddEditSectionComponent,
  ],
  templateUrl: './produits-chimiques.component.html',
  styleUrl: './produits-chimiques.component.scss',
})
export class ProduitsChimiquesComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  displayedColumns: string[] = [
    'labelProduitConsommable',
    'quantiteProduitConsommable',
    'dateUtilisationProduitConsommable',
    'nomStation',
    'labelUnite',
    'nomCategorieProduitChimique',
    'actions',
  ];
  dataSource: MatTableDataSource<ProduitChimiqueInterface> =
    new MatTableDataSource<ProduitChimiqueInterface>();
  produitChimique: ProduitChimiqueInterface | null = null;
  private produitsChimiquesUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private produitChimiqueService: ProduitChimiqueService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchProduitsChimiques();
    this.produitsChimiquesUpdatedSub =
      this.produitChimiqueService.produitsChimiquesUpdated$.subscribe(() => {
        this.fetchProduitsChimiques();
      });
  }

  ngOnDestroy(): void {
    if (this.produitsChimiquesUpdatedSub) {
      this.produitsChimiquesUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchProduitsChimiques() {
    this.produitChimiqueService
      .getProduitsChimiques()
      .subscribe((produitsChimiques: ProduitChimiqueInterface[]) => {
        this.dataSource.data = produitsChimiques;
      });
  }

  openDialog(produitChimique: ProduitChimiqueInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { produitChimique },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && produitChimique.idProduitConsommable) {
        this.handleDelete(produitChimique.idProduitConsommable);
      }
    });
  }

  handleDelete(idProduitConsommable: string): void {
    this.produitChimiqueService
      .deleteProduitChimique(idProduitConsommable)
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
    this.router.navigate(['/produits-chimiques']);
    this.fetchProduitsChimiques();
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
        case 'nomCategorieProduitChimique':
          return compare(
            a.nomCategorieProduitChimique,
            b.nomCategorieProduitChimique,
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
