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
import { MessageResponseInterface } from '../../../Interfaces/message-response.interface';
import { DeleteConfirmationDialogComponent } from '../../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { CategorieProduitChimiqueInterface } from '../../../Interfaces/categorie-produit-chimique.interface';
import { CategorieProduitChimiqueService } from '../../../Services/categorie-produit-chimique.service';

@Component({
  selector: 'app-categories-produits-chimiques',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    DatePipe,
    AddEditSectionComponent,
  ],
  templateUrl: './categories-produits-chimiques.component.html',
  styleUrl: './categories-produits-chimiques.component.scss',
})
export class CategoriesProduitsChimiquesComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  displayedColumns: string[] = ['nomCategorieProduitChimique', 'actions'];
  dataSource: MatTableDataSource<CategorieProduitChimiqueInterface> =
    new MatTableDataSource<CategorieProduitChimiqueInterface>();
  produitChimique: CategorieProduitChimiqueInterface | null = null;
  private produitsChimiquesUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private categorieProduitChimiqueService: CategorieProduitChimiqueService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchCategoriesProduitsChimiques();
    this.produitsChimiquesUpdatedSub =
      this.categorieProduitChimiqueService.categoriesProduitsChimiquesUpdated$.subscribe(
        () => {
          this.fetchCategoriesProduitsChimiques();
        }
      );
  }

  ngOnDestroy(): void {
    if (this.produitsChimiquesUpdatedSub) {
      this.produitsChimiquesUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchCategoriesProduitsChimiques() {
    this.categorieProduitChimiqueService
      .getCategoriesProduitsChimiques()
      .subscribe((produitsChimiques: CategorieProduitChimiqueInterface[]) => {
        this.dataSource.data = produitsChimiques;
      });
  }

  openDialog(produitChimique: CategorieProduitChimiqueInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { produitChimique },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && produitChimique.idCategorieProduitChimique) {
        this.handleDelete(produitChimique.idCategorieProduitChimique);
      }
    });
  }

  handleDelete(idCategorieProduitChimique: string): void {
    this.categorieProduitChimiqueService
      .deleteCategorieProduitChimique(idCategorieProduitChimique)
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
    this.router.navigate(['/categories-produits-chimiques']);
    this.fetchCategoriesProduitsChimiques();
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
